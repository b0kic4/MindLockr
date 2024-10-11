import React from "react";
import {
  RetrieveAsymmetricKeys,
  RetrieveSymmetricKeys,
} from "../../../wailsjs/go/keys/KeyRetrieve";
import {
  LogError,
  LogPrint,
  LogWarning,
} from "../../../wailsjs/runtime/runtime";

interface FileInfo {
  name: string;
  type: string;
}

interface FolderInfo {
  name: string;
  files: FileInfo[];
}

interface SymmetricKey {
  name: string;
  algorithm: string;
  type: "Symmetric";
}

export interface KeyData {
  symmetric: SymmetricKey[];
  asymmetric: FolderInfo[];
}

export function useKeys() {
  const [keys, setKeys] = React.useState<KeyData>({
    symmetric: [],
    asymmetric: [],
  });

  const fetchKeys = async () => {
    try {
      const [symmetricKeys, asymmetricFolders] = await Promise.all([
        RetrieveSymmetricKeys().catch((error) => {
          LogWarning("No symmetric keys found or error occurred: " + error);
          return [];
        }),
        RetrieveAsymmetricKeys().catch((error) => {
          LogWarning("No asymmetric keys found or error occurred: " + error);
          return [];
        }),
      ]);

      LogPrint("Keys retrieved successfully.");

      const symmetric = (symmetricKeys || []).map((key) => ({
        name: key.name,
        algorithm: key.algorithm,
        type: "Symmetric" as const,
      }));

      const asymmetric = asymmetricFolders || [];

      setKeys({ symmetric, asymmetric });
    } catch (error) {
      LogError("Error retrieving keys: " + error);
      console.error("Error retrieving keys:", error);
    }
  };

  React.useEffect(() => {
    fetchKeys();
  }, []);

  return { keys, fetchKeys };
}
