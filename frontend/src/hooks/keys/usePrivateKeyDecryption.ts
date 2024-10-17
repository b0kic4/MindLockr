import { DecryptPgpPrivKey } from "@wailsjs/go/keys/PgpKeysGen";
import { LogError } from "@wailsjs/runtime/runtime.js";
import React from "react";
import { useToast } from "../use-toast";

interface Props {
  keyName: string;
}

export function usePrivateKeyDecryption({ keyName }: Props) {
  const [decryptedPrivKey, setDecryptedPrivKey] = React.useState<string>("");
  const [isPrivKeyVisible, setIsPrivKeyVisible] =
    React.useState<boolean>(false);
  const { toast } = useToast();

  const handleDecryptPrivKey = async (passphrase: string) => {
    try {
      const decrypted = await DecryptPgpPrivKey(passphrase, keyName);
      setDecryptedPrivKey(decrypted);
      setIsPrivKeyVisible(true);

      // Hide the decrypted private key after 30 seconds
      setTimeout(() => {
        setDecryptedPrivKey("");
        setIsPrivKeyVisible(false);
      }, 30000);
    } catch (error) {
      LogError(error as any);
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Uh oh! Something went wrong.",
        description: "Error decrypting the private key.",
      });
    }
  };

  // Function to hide the private key immediately
  const handleHidePrivKey = () => {
    setDecryptedPrivKey("");
    setIsPrivKeyVisible(false);
  };

  return {
    decryptedPrivKey,
    isPrivKeyVisible,
    handleDecryptPrivKey,
    handleHidePrivKey,
  };
}
