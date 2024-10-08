import { create } from "zustand";

type PrivPubState = {
  privKey: string;
  pubKey: string;
};

type PrivPubActions = {
  setPrivKey: (privKey: string) => void;
  setPubKey: (pubKey: string) => void;
  clearKeys: () => void;
};

const usePubPrivStore = create<PrivPubState & PrivPubActions>((set) => ({
  privKey: "",
  pubKey: "",

  setPrivKey: (privKey) => set({ privKey }),
  setPubKey: (pubKey) => set({ pubKey }),
  clearKeys: () => set({ privKey: "", pubKey: "" }),
}));

export default usePubPrivStore;
