import { create } from "zustand";

type FileState = {
  selectedCurve: string;
};

type FileActions = {
  setSelectedCurve: (curve: string) => void;
  clearSelectedCurve: () => void;
};

const useSelectCurve = create<FileState & FileActions>((set) => ({
  selectedCurve: "",
  setSelectedCurve: (curve: string) => set({ selectedCurve: curve }),
  clearSelectedCurve: () => set({ selectedCurve: "" }),
}));

export default useSelectCurve;
