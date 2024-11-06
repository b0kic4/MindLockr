import { create } from "zustand";
import { en } from "@wailsjs/go/models";

type FilesState = {
  selectedEncryption: en.FileInfo | null;
  selectedValidation: en.FileInfo | null;
};

type FilesActions = {
  setSelectedEncryption: (file: en.FileInfo) => void;
  setSelectedValidation: (file: en.FileInfo) => void;
};

const useSelectedValSymEnStore = create<FilesState & FilesActions>((set) => ({
  selectedEncryption: null,
  selectedValidation: null,
  setSelectedEncryption: (file) => set({ selectedEncryption: file }),
  setSelectedValidation: (file) => set({ selectedValidation: file }),
}));

export default useSelectedValSymEnStore;
