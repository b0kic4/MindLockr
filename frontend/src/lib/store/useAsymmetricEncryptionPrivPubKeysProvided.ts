import { create } from "zustand";

type PgpInputState = {
  selectedPgpKeyPair: string;
  providedPrivKey: string;
  providedPubKey: string;
};

type PgpInputActions = {
  setSelectPgpKeyPair: (folder: string) => void;
  setProvidedPrivKey: (providedPrivKey: string) => void;
  setProvidedPubKey: (providedPubKey: string) => void;
  clearPub: () => void;
  clearPriv: () => void;
  clearPair: () => void;
};

const usePgpAsymmetricEncryptionInputsStore = create<
  PgpInputState & PgpInputActions
>((set) => ({
  selectedPgpKeyPair: "",
  providedPrivKey: "",
  providedPubKey: "",

  setSelectPgpKeyPair: (folder: string) => set({ selectedPgpKeyPair: folder }),
  setProvidedPrivKey: (providedPrivKey) => set({ providedPrivKey }),
  setProvidedPubKey: (providedPubKey) => set({ providedPubKey }),
  clearPub: () => set({ providedPubKey: "" }),
  clearPriv: () => set({ providedPrivKey: "" }),
  clearPair: () => set({ selectedPgpKeyPair: "" }),
}));

export default usePgpAsymmetricEncryptionInputsStore;
