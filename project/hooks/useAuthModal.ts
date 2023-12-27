import { create } from "zustand";

interface AuthModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  //   OPEN
  onOpen: () => set({ isOpen: true }),
  //   CLOSE
  onClose: () => set({ isOpen: false }),
}));

export default useAuthModal;
