import { create } from "zustand";

type LastDecryptedPassphraseState = {
  passphrase: string;
};

type LastDecryptedPassphraseAction = {
  setPassphrase: (passphrase: string) => void;
  clearLastDecPassphrase: () => void;
};

const useLastDecryptedPassphrase = create<
  LastDecryptedPassphraseState & LastDecryptedPassphraseAction
>((set) => ({
  passphrase: "",

  setPassphrase: (passphrase) => set({ passphrase }),
  clearLastDecPassphrase: () => set({ passphrase: "" }),
}));

export default useLastDecryptedPassphrase;
