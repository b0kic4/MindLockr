import React from "react";
import { RetrievePgpKeys } from "@wailsjs/go/keys/KeyRetrieve";
import { LogError, LogInfo } from "@wailsjs/runtime/runtime";
import { keys } from "@wailsjs/go/models";
import { useToast } from "@/hooks/use-toast";

export function usePgpKeys() {
  const [pgpKeys, setPgpKeys] = React.useState<keys.PgpKeyInfo[]>([]);
  const { toast } = useToast();

  const fetchPgpKeys = React.useCallback(async () => {
    try {
      const keys = await RetrievePgpKeys();

      setPgpKeys(keys);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : JSON.stringify(error);
      LogError("Error retrieving PGP keys: " + errorMessage);

      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Error retrieving PGP keys",
        description: errorMessage,
      });
    }
  }, [setPgpKeys, toast]);

  React.useEffect(() => {
    fetchPgpKeys();
  }, [fetchPgpKeys]);

  return { pgpKeys, fetchPgpKeys };
}
