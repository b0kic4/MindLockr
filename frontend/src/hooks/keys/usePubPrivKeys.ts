import React from "react";
import {
  RetrievePrivKey,
  RetrievePubKey,
} from "@wailsjs/go/keys/PubPrvKeyGen.js";
import { LogError } from "@wailsjs/runtime/runtime.js";
import { toast } from "@/hooks/use-toast.js";

export function usePubPriv() {
  const [privKey, setPrivKey] = React.useState<string>("");
  const [pubKey, setPubKey] = React.useState<string>("");

  React.useEffect(() => {
    async function getPubPrivKeys() {
      try {
        const publicKey = await RetrievePubKey();
        setPubKey(publicKey);
      } catch (error) {
        LogError(error as any);
        toast({
          variant: "destructive",
          className: "bg-red-500 border-0",
          title: "Uh oh! Something went wrong.",
          description: "Error when retrieving public key",
        });
      }

      try {
        const privateKey = await RetrievePrivKey();
        setPrivKey(privateKey);
      } catch (error) {
        LogError(error as any);
        toast({
          variant: "destructive",
          className: "bg-red-500 border-0",
          title: "Uh oh! Something went wrong.",
          description: "Error when retrieving private key",
        });
      }
    }
    getPubPrivKeys();
  }, []);

  return { privKey, setPrivKey, pubKey, setPubKey };
}
