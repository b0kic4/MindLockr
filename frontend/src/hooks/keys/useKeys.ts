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

interface KeyInfo {
  name: string;
  algorithm: string;
  type: "Symmetric" | "Asymmetric";
}

export function useKeys() {
  const [keys, setKeys] = React.useState<KeyInfo[]>([]);

  const fetchKeys = async () => {
    try {
      const [symmetricKeys, asymmetricKeys] = await Promise.all([
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

      const allKeys = [
        ...(symmetricKeys || []).map((key) => ({
          name: key.name,
          algorithm: key.algorithm,
          type: "Symmetric" as const,
        })),
        ...(asymmetricKeys || []).map((key) => ({
          name: key.name,
          algorithm: key.algorithm,
          type: "Asymmetric" as const,
        })),
      ];

      setKeys(allKeys);
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
