import { KeyData } from "@/lib/types/keys";
import React from "react";
import {
  RetrieveAsymEn,
  RetrieveSymEn,
} from "../../../wailsjs/go/en/EnRetrieve";
import {
  LogError,
  LogPrint,
  LogWarning,
} from "../../../wailsjs/runtime/runtime";

export function useKeys() {
  const [keys, setKeys] = React.useState<KeyData>({
    symmetric: [],
    asymmetric: [],
  });

  const fetchKeys = async () => {
    try {
      const [symEn, asymFolders] = await Promise.all([
        RetrieveSymEn().catch((error) => {
          LogWarning("No symmetric keys found or error occurred: " + error);
          return [];
        }),
        RetrieveAsymEn().catch((error) => {
          LogWarning("No asymmetric keys found or error occurred: " + error);
          return [];
        }),
      ]);

      LogPrint("Keys retrieved successfully.");

      const symmetric = (symEn || []).map((key) => ({
        name: key.name,
        algorithm: key.algorithm,
        type: "Symmetric" as const,
      }));

      const asymmetric = asymFolders || [];

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
