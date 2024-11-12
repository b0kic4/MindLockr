export interface KeyInfo {
  name: string;
  algorithm: string;
  type: "Symmetric" | "Asymmetric";
}

export interface DataToDecrypt {
  encryptedKey: KeyInfo;
  passphrase: string;
}

export interface FileInfo {
  name: string;
  type: string;
  path: string;
}

export interface SymmetricKey {
  name: string;
  algorithm: string;
  type: "Symmetric";
}

export interface KeyData {
  symmetric: SymmetricKey[];
  asymmetric: FileInfo[];
}

export type PGPInfo = {
  [key: string]: string;
};
