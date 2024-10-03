export interface KeyInfo {
  name: string;
  algorithm: string;
  type: "Symmetric" | "Asymmetric";
}

export interface DataToDecrypt {
  encryptedKey: KeyInfo;
  passphrase: string;
}
