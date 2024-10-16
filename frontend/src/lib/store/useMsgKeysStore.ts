import { create } from "zustand";

type MsgKeyState = {
  privKey: string;
  pubKey: string;
};

type MsgKeyActions = {
  setPrivKey: (privKey: string) => void;
  setPubKey: (pubKey: string) => void;
  clearKeys: () => void;
};

const useMsgKeysStore = create<MsgKeyState & MsgKeyActions>((set) => ({
  privKey: "",
  pubKey: "",

  setPrivKey: (privKey) => set({ privKey }),
  setPubKey: (pubKey) => set({ pubKey }),
  clearKeys: () => set({ privKey: "", pubKey: "" }),
}));

export default useMsgKeysStore;
