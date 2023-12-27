"use client";

import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";

// Define the prop types for the LikeButton component
interface LikeButtonProps {
  songId: string;
}

// LikeButton component definition
const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  // Next.js router
  const router = useRouter();

  // Supabase session context
  const { supabaseClient } = useSessionContext();

  // Auth modal hook for handling authentication
  const authModal = useAuthModal();

  // User information hook
  const { user } = useUser();

  // State to track whether the song is liked or not
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // Effect to check if the song is liked when the component mounts
  useEffect(() => {
    if (!user?.id) {
      return;
    }

    // Fetch data from Supabase to check if the song is liked by the user
    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from("liked_songs")
        .select("*")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .single();

      if (!error && data) {
        setIsLiked(true);
      }
    };

    fetchData();
  }, [songId, supabaseClient, user?.id]);

  // Icon component based on whether the song is liked or not
  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  // Handler for liking/unliking a song
  const handleLike = async () => {
    // If the user is not logged in, open the authentication modal
    if (!user) {
      return authModal.onOpen();
    }

    // If the song is already liked, delete the like; otherwise, insert a new like
    if (isLiked) {
      const { error } = await supabaseClient
        .from("liked_songs")
        .delete()
        .eq("user_id", user.id)
        .eq("song_id", songId);

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
      }
    } else {
      const { error } = await supabaseClient.from("liked_songs").insert({
        song_id: songId,
        user_id: user.id,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(true);
        toast.success("Success");
      }
    }

    // Refresh the page after liking/unliking to reflect changes
    router.refresh();
  };

  // Render the LikeButton component
  return (
    <button
      className="
        cursor-pointer 
        hover:opacity-75 
        transition
      "
      onClick={handleLike}
    >
      <Icon color={isLiked ? "#22c55e" : "white"} size={25} />
    </button>
  );
};

// Export the LikeButton component
export default LikeButton;
