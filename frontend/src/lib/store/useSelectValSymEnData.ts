import { create } from "zustand";
import { keys } from "@wailsjs/go/models";

type FilesState = {
  selectedEncryption: keys.FileInfo | null;
  selectedValidation: keys.FileInfo | null;
};

type FilesActions = {
  setSelectedEncryption: (file: keys.FileInfo) => void;
  setSelectedValidation: (file: keys.FileInfo) => void;
};

const useSelectedValSymEnStore = create<FilesState & FilesActions>((set) => ({
  selectedEncryption: null,
  selectedValidation: null,
  setSelectedEncryption: (file) => set({ selectedEncryption: file }),
  setSelectedValidation: (file) => set({ selectedValidation: file }),
}));

export default useSelectedValSymEnStore;
