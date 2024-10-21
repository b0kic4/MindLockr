import { create } from "zustand";

type FileState = {
  selectedAlg: string;
};

type FileActions = {
  setSelectedAlg: (alg: string) => void;
  clearSelectedAlg: () => void;
};

const useSelectAlgPgpGen = create<FileState & FileActions>((set) => ({
  selectedAlg: "",
  setSelectedAlg: (alg) => set({ selectedAlg: alg }),
  clearSelectedAlg: () => set({ selectedAlg: "" }),
}));

export default useSelectAlgPgpGen;
