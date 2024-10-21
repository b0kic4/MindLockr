import { create } from "zustand";

type PgpInputState = {
  selectedPgpKeyPair: string;
  providedPrivKey: string;
  providedPubKey: string;
  encType: string;
};

type PgpInputActions = {
  setSelectPgpKeyPair: (folder: string) => void;
  setProvidedPrivKey: (providedPrivKey: string) => void;
  setProvidedPubKey: (providedPubKey: string) => void;
  setEncType: (type: string) => void;
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
  encType: "ECC",

  setSelectPgpKeyPair: (folder: string) => set({ selectedPgpKeyPair: folder }),
  setProvidedPrivKey: (providedPrivKey) => set({ providedPrivKey }),
  setProvidedPubKey: (providedPubKey) => set({ providedPubKey }),
  setEncType: (enc: string) => set({ encType: enc }),
  clearPub: () => set({ providedPubKey: "" }),
  clearPriv: () => set({ providedPrivKey: "" }),
  clearPair: () => set({ selectedPgpKeyPair: "" }),
}));

export default usePgpAsymmetricEncryptionInputsStore;
