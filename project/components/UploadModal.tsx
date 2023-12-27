"use client";

// Import necessary modules and components
import { useState } from "react";

// hooks
import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";
// components
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
// packages
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import router from "next/router";

// Define the UploadModal component
const UploadModal = () => {
  // State to track loading status
  const [isLoading, setIsLoading] = useState(false);
  // Custom hook for managing the upload modal state

  // Supabase client for interacting with Supabase services
  const supabaseClient = useSupabaseClient();

  const uploadModal = useUploadModal();

  // Custom hook to get user information
  const { user } = useUser();

  // React Hook Form for handling form state and validation
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null,
    },
  });

  // Handler for modal state change
  const onChange = (open: boolean) => {
    if (!open) {
      // On close, reset the form and close the modal
      reset();
      uploadModal.onClose();
    }
  };

  // Form submission handler
  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      // image file
      const imageFile = values.image?.[0];
      // audio file
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error("Missing fields");
        return;
      }

      // Generate a unique ID for file naming
      const uniqueID = uniqid();

      // Upload song
      const { data: songData, error: songError } = await supabaseClient.storage
        .from("songs")
        .upload(`song-${values.title}-${uniqueID}`, songFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (songError) {
        setIsLoading(false);
        return toast.error("Failed song upload");
      }

      // Upload image
      const { data: imageData, error: imageError } =
        await supabaseClient.storage
          .from("images")
          .upload(`image-${values.title}-${uniqueID}`, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

      if (imageError) {
        setIsLoading(false);
        return toast.error("Failed image upload");
      }

      // Create record
      const { error: supabaseError } = await supabaseClient
        .from("songs")
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          image_path: imageData.path,
          song_path: songData.path,
        });

      if (supabaseError) {
        return toast.error(supabaseError.message);
      }

      // router.refresh();
      setIsLoading(true);
      toast.success("Song created!");
      reset();
      uploadModal.onClose();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Add song"
      description="Upload file here"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        {/* Title input */}
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="Song title"
        />

        {/* Author input */}
        <Input
          id="author"
          disabled={isLoading}
          {...register("author", { required: true })}
          placeholder="Author"
        />

        {/* Song file input */}
        <div>
          <div className="pb-1">Select song file</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            {...register("song", { required: true })}
          />
        </div>

        {/* Image file input */}
        <div>
          <div className="pb-1">Select image file</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register("image", { required: true })}
          />
        </div>

        {/* Submit button */}
        <Button disabled={isLoading} type="submit">
          Upload File
        </Button>
      </form>
    </Modal>
  );
};

// Export the UploadModal component
export default UploadModal;
