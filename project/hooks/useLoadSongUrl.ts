// Import the useSupabaseClient hook from the Supabase auth helpers
import { useSupabaseClient } from "@supabase/auth-helpers-react";

// Import the Song type from the specified location
import { Song } from "@/types";

// Custom hook to load the URL of a song
const useLoadSongUrl = (song: Song) => {
  // Access the Supabase client using the useSupabaseClient hook
  const supabaseClient = useSupabaseClient();

  // Check if the song object is provided
  if (!song) {
    // If not, return an empty string
    return "";
  }

  // Use the Supabase storage client to get the public URL of the song
  const { data: songData } = supabaseClient.storage
    .from("songs")
    .getPublicUrl(song.song_path);

  // Return the public URL of the song
  return songData.publicUrl;
};

// Export the custom hook for external use
export default useLoadSongUrl;
