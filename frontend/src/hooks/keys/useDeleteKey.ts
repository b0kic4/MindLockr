import React from "react";
import { KeyInfo } from "@/lib/types/keys";
import {
  DeleteSymKey,
  DeleteHybKey,
} from "../../../wailsjs/go/keys/KeyRetrieve";
import { useToast } from "@/hooks/use-toast";

interface UseDeleteKeyParams {
  fetchKeys: () => Promise<void>;
}

// this work only for symmetric encryption
export function useSymDeleteKey({ fetchKeys }: UseDeleteKeyParams) {
  const { toast } = useToast();

  const handleSymDelete = React.useCallback(
    async (key: KeyInfo) => {
      const response = await DeleteSymKey(key);
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

  return { handleSymDelete };
}

export function useHybDeleteKey({ fetchKeys }: UseDeleteKeyParams) {
  const { toast } = useToast();

  // FIXME: NEED TO CONFIGURE THE TYPE
  const handleHybDelete = React.useCallback(
    async (key: any) => {
      const response = await DeleteHybKey(key);
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

  return { handleHybDelete };
}
