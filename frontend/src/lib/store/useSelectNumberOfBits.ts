import { create } from "zustand";

type FileState = {
  selectedBits: number;
};

type FileActions = {
  setSelectedBits: (num: number) => void;
  clearSelectedBits: () => void;
};

const useSelectNumOfBits = create<FileState & FileActions>((set) => ({
  selectedBits: 0,
  setSelectedBits: (num) => set({ selectedBits: num }),
  clearSelectedBits: () => set({ selectedBits: 0 }),
}));

export default useSelectNumOfBits;
