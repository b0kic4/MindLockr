import { create } from "zustand";
import { keys } from "@wailsjs/go/models";

type FileState = {
  selectedFile: keys.FileInfo | null;
};

type FileActions = {
  setSelectedFile: (file: keys.FileInfo) => void;
};

const useSelectedAsymmetricFileStore = create<FileState & FileActions>(
  (set) => ({
    selectedFile: null,
    setSelectedFile: (file) => set({ selectedFile: file }),
  }),
);

export default useSelectedAsymmetricFileStore;
