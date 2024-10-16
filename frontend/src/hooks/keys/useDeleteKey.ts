import React from "react";
import { KeyInfo } from "@/lib/types/keys";
import { DeleteKey } from "../../../wailsjs/go/keys/KeyRetrieve";
import { useToast } from "@/hooks/use-toast";

interface UseDeleteKeyParams {
  fetchKeys: () => Promise<void>;
}

// this work only for symmetric encryption
export function useDeleteKey({ fetchKeys }: UseDeleteKeyParams) {
  const { toast } = useToast();

  const handleDelete = React.useCallback(
    async (key: KeyInfo) => {
      const response = await DeleteKey(key);
      if (response) {
        await fetchKeys();
        toast({
          variant: "default",
          className: "border-0",
          title: "Key deleted successfully",
        });
      } else {
        toast({
          variant: "destructive",
          className: "bg-red-500 border-0",
          title: "Uh oh! Something went wrong.",
          description: "Deletion of the key has failed.",
        });
      }
    },
    [fetchKeys, toast],
  );

  return { handleDelete };
}
