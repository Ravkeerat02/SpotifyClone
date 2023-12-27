import { create } from "zustand";

interface UploadModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useuploadModal = create<UploadModalStore>((set) => ({
  isOpen: false,
  //   OPEN
  onOpen: () => set({ isOpen: true }),
  //   CLOSE
  onClose: () => set({ isOpen: false }),
}));

export default useuploadModal;
