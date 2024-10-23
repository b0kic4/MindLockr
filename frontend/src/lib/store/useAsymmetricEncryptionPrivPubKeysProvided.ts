import { create } from "zustand";

type PgpInputState = {
  selectedPgpKeyPair: string;
  encPrivKey: string;
  providedPrivKey: string;
  providedPubKey: string;
};

type PgpInputActions = {
  setSelectPgpKeyPair: (folder: string) => void;
  setEncPrivKey: (encKey: string) => void;
  setProvidedPrivKey: (providedPrivKey: string) => void;
  setProvidedPubKey: (providedPubKey: string) => void;
  clearPub: () => void;
  clearEnKey: () => void;
  clearPriv: () => void;
  clearPair: () => void;
};

const usePgpAsymmetricEncryptionInputsStore = create<
  PgpInputState & PgpInputActions
>((set) => ({
  selectedPgpKeyPair: "",
  encPrivKey: "",
  providedPrivKey: "",
  providedPubKey: "",

  setSelectPgpKeyPair: (folder: string) => set({ selectedPgpKeyPair: folder }),
  setEncPrivKey: (encKey) => set({ encPrivKey: encKey }),
  setProvidedPrivKey: (providedPrivKey) => set({ providedPrivKey }),
  setProvidedPubKey: (providedPubKey) => set({ providedPubKey }),
  clearPub: () => set({ providedPubKey: "" }),
  clearEnKey: () => set({ encPrivKey: "" }),
  clearPriv: () => set({ providedPrivKey: "" }),
  clearPair: () => set({ selectedPgpKeyPair: "" }),
}));

export default usePgpAsymmetricEncryptionInputsStore;
