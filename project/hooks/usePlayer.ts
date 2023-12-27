import { create } from "zustand";

interface PlayerStore {
  ids: string[];
  activeId?: string;
  isShuffle: boolean; // New property to track shuffle mode
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  toggleShuffle: () => void; // Function to toggle shuffle mode
  reset: () => void;
}

const usePlayer = create<PlayerStore>((set) => ({
  ids: [],
  activeId: undefined,
  isShuffle: false, // Initialize shuffle mode to false
  setId: (id: string) => set({ activeId: id }),
  setIds: (ids: string[]) => set({ ids: ids }),
  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })), // Toggle shuffle mode
  reset: () => set({ ids: [], activeId: undefined, isShuffle: false }), // Reset shuffle mode on reset
}));

export default usePlayer;
