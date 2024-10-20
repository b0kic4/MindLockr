import useMsgKeysStore from "@/lib/store/useMsgKeysStore";
import {
  RetrievePgpPrivKey,
  RetrievePgpPubKey,
} from "@wailsjs/go/keys/KeyRetrieve";
import { LogError } from "@wailsjs/runtime/runtime.js";
import React from "react";
import { useToast } from "../use-toast";

interface Props {
  folderPath: string;
}

export function useMsgPGP({ folderPath }: Props) {
  const { setPrivKey, setPubKey, clearKeys, privKey, pubKey } =
    useMsgKeysStore();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!folderPath) {
      clearKeys();
      return;
    }

    async function getPgpKeys() {
      try {
        const publicKey = await RetrievePgpPubKey("msg");
        setPubKey(publicKey);
      } catch (error) {
        LogError("Error retrieving public key");
        LogError(error as any);
        toast({
          variant: "destructive",
          className: "bg-red-500 border-0",
          title: "Public Key Retrieval Failed",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.",
        });
      }

      try {
        const privateKey = await RetrievePgpPrivKey("msg");
        setPrivKey(privateKey);
      } catch (error) {
        LogError("Error retrieving private key");
        toast({
          variant: "destructive",
          className: "bg-red-500 border-0",
          title: "Private Key Retrieval Failed",
          description:
            "Unable to retrieve private key. Please check the folder path and try again.",
        });
      }
    }

    getPgpKeys();
  }, [folderPath, setPrivKey, setPubKey, clearKeys]);

  return { privKey, pubKey, setPrivKey, setPubKey };
}
