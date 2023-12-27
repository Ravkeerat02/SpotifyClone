import { create } from "zustand";

interface SubscribeModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useSubscribeModal = create<SubscribeModalStore>((set) => ({
  isOpen: false,
  //   OPEN
  onOpen: () => set({ isOpen: true }),
  //   CLOSE
  onClose: () => set({ isOpen: false }),
}));

export default useSubscribeModal;
