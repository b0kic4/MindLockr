import { useCallback } from "react";
import {
  AES128Decryption,
  AES192Decryption,
  AES256Decryption,
} from "../../wailsjs/go/symmetricdecryption/Cryptography";

interface DecryptParams {
  algorithm: string;
  encryptedData: string;
  passphrase: string;
}

export function useDecryption() {
  const decryptData = useCallback(
    async ({ algorithm, encryptedData, passphrase }: DecryptParams) => {
      switch (algorithm) {
        case "AES-128":
          return await AES128Decryption({ encryptedData, passphrase });
        case "AES-192":
          return await AES192Decryption({ encryptedData, passphrase });
        case "AES-256":
          return await AES256Decryption({ encryptedData, passphrase });
        default:
          throw new Error(`Unsupported algorithm: ${algorithm}`);
      }
    },
    [],
  );

  return { decryptData };
}
