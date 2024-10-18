import { create } from "zustand";

type PgpInputState = {
  providedPrivKey: string;
  providedPubKey: string;
};

type PgpInputActions = {
  setProvidedPrivKey: (providedPrivKey: string) => void;
  setProvidedPubKey: (providedPubKey: string) => void;
  clearInputs: () => void;
};

const usePgpAsymmetricEncryptionInputsStore = create<
  PgpInputState & PgpInputActions
>((set) => ({
  providedPrivKey: "",
  providedPubKey: "",

  setProvidedPrivKey: (providedPrivKey) => set({ providedPrivKey }),
  setProvidedPubKey: (providedPubKey) => set({ providedPubKey }),
  clearInputs: () => set({ providedPrivKey: "", providedPubKey: "" }),
}));

export default usePgpAsymmetricEncryptionInputsStore;
