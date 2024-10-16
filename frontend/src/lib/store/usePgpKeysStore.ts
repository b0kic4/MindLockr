import { create } from "zustand";

type PgpKeysState = {
  pgpKeys: string[];
  selectedPgpKeyPair: string;
};

type PgpKeysActions = {
  setPgpKeys: (folders: string[]) => void;
  addPgpKey: (folder: string) => void;
  setSelectPgpKeyPair: (folder: string) => void;
  removePgpKey: (folder: string) => void;
  clearKeys: () => void;
};

const usePgpKeysStore = create<PgpKeysState & PgpKeysActions>((set) => ({
  pgpKeys: [],
  selectedPgpKeyPair: "",

  // Set the entire array of PGP keys
  setPgpKeys: (folders: string[]) => set({ pgpKeys: folders }),

  // Add a single PGP key
  addPgpKey: (folder: string) =>
    set((state) => ({ pgpKeys: [...state.pgpKeys, folder] })),

  setSelectPgpKeyPair: (folder: string) => set({ selectedPgpKeyPair: folder }),

  // Remove a single PGP key
  removePgpKey: (folder: string) =>
    set((state) => ({
      pgpKeys: state.pgpKeys.filter((key) => key !== folder),
    })),

  // Clear all PGP keys
  clearKeys: () => set({ pgpKeys: [] }),
}));

export default usePgpKeysStore;
