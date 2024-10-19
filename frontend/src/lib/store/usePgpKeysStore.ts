import { create } from "zustand";

// these values are used in select pgp keys
// component for retrieving the pgp keys pair
// ( public or private pgp keys or both )

type PgpKeysState = {
  pgpKeys: string[];
};

type PgpKeysActions = {
  setPgpKeys: (folders: string[]) => void;
  addPgpKey: (folder: string) => void;
  removePgpKey: (folder: string) => void;
  clearKeys: () => void;
};

const usePgpKeysStore = create<PgpKeysState & PgpKeysActions>((set) => ({
  pgpKeys: [],

  // Set the entire array of PGP keys
  setPgpKeys: (folders: string[]) => set({ pgpKeys: folders }),

  // Add a single PGP key
  addPgpKey: (folder: string) =>
    set((state) => ({ pgpKeys: [...state.pgpKeys, folder] })),

  // Remove a single PGP key
  removePgpKey: (folder: string) =>
    set((state) => ({
      pgpKeys: state.pgpKeys.filter((key) => key !== folder),
    })),

  clearKeys: () => set({ pgpKeys: [] }),
}));

export default usePgpKeysStore;
