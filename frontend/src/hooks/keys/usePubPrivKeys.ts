import React from "react";
import {
  RetrievePrivKey,
  RetrievePubKey,
} from "@wailsjs/go/keys/PubPrvKeyGen.js";
import { LogError, LogInfo } from "@wailsjs/runtime/runtime.js";
import { useToast } from "../use-toast";

interface Props {
  folderPath: string;
}

export function usePubPriv({ folderPath }: Props) {
  const [privKey, setPrivKey] = React.useState<string>("");
  const [pubKey, setPubKey] = React.useState<string>("");
  const { toast } = useToast();

  React.useEffect(() => {
    LogInfo(`Folder path: ${folderPath}`);
  }, [folderPath]);

  React.useEffect(() => {
    async function getPubPrivKeys() {
      try {
        const publicKey = await RetrievePubKey();
        setPubKey(publicKey);
      } catch (error) {
        LogError("Error retrieving public key");
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
        const privateKey = await RetrievePrivKey();
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

    getPubPrivKeys();
  }, [folderPath]);

  return { privKey, setPrivKey, pubKey, setPubKey };
}
