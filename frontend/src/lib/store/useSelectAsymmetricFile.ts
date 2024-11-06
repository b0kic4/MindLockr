import { create } from "zustand";
import { en } from "@wailsjs/go/models";

type FileState = {
  selectedFile: en.FileInfo | null;
};

type FileActions = {
  setSelectedFile: (file: en.FileInfo) => void;
};

const useSelectedAsymmetricFileStore = create<FileState & FileActions>(
  (set) => ({
    selectedFile: null,
    setSelectedFile: (file) => set({ selectedFile: file }),
  }),
);

export default useSelectedAsymmetricFileStore;
