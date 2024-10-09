import { create } from "zustand";

type PrivPubInputState = {
  providedPrivKey: string;
  providedPubKey: string;
};

type PrivPubInputActions = {
  setProvidedPrivKey: (providedPrivKey: string) => void;
  setProvidedPubKey: (providedPubKey: string) => void;
  clearInputs: () => void;
};

const usePubPrivAsymmetricEncryptionInputsStore = create<
  PrivPubInputState & PrivPubInputActions
>((set) => ({
  providedPrivKey: "",
  providedPubKey: "",

  setProvidedPrivKey: (providedPrivKey) => set({ providedPrivKey }),
  setProvidedPubKey: (providedPubKey) => set({ providedPubKey }),
  clearInputs: () => set({ providedPrivKey: "", providedPubKey: "" }),
}));

export default usePubPrivAsymmetricEncryptionInputsStore;
