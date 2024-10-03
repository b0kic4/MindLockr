import {
  AES128Decryption,
  AES192Decryption,
  AES256Decryption,
} from "../../../wailsjs/go/symmetricdecryption/Cryptography";

interface DecryptParams {
  algorithm: string;
  encryptedData: string;
  passphrase: string;
}

export async function decryptData({
  algorithm,
  encryptedData,
  passphrase,
}: DecryptParams): Promise<string> {
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
}
