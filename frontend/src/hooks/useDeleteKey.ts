import { useCallback } from "react";
import { KeyInfo } from "@/lib/types/keys";
import { DeleteKey } from "../../wailsjs/go/keys/KeyRetrieve";
import { useKeys } from "@/hooks/keyring-management/useKeys";
import { useToast } from "@/hooks/use-toast";

export function useDeleteKey() {
  const { fetchKeys } = useKeys();
  const { toast } = useToast();

  const handleDelete = useCallback(
    async (key: KeyInfo) => {
      const response = await DeleteKey(key);
      if (response) {
        fetchKeys();
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
