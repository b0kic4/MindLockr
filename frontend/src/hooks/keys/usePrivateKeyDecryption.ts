import { DecryptPgpPrivKey } from "@wailsjs/go/keys/PgpKeysGen";
import { LogError } from "@wailsjs/runtime/runtime.js";
import React from "react";
import { useToast } from "../use-toast";

interface Props {
  keyPath: string;
}

export function usePrivateKeyDecryption({ keyPath }: Props) {
  const [decryptedPrivKey, setDecryptedPrivKey] = React.useState<string>("");
  const [isDec, setIsDec] = React.useState<boolean>(false);
  const [isPrivKeyVisible, setIsPrivKeyVisible] =
    React.useState<boolean>(false);
  const { toast } = useToast();

  React.useEffect(() => {
    setDecryptedPrivKey("");
    setIsPrivKeyVisible(false);
  }, [keyPath]);

  const handleDecryptPrivKey = async (passphrase: string) => {
    try {
      const decrypted = await DecryptPgpPrivKey(passphrase, keyPath);
      setDecryptedPrivKey(decrypted);
      setIsPrivKeyVisible(true);
      setIsDec(true);

      // Hide the decrypted private key after 30 seconds
      setTimeout(() => {
        setDecryptedPrivKey("");
        setIsPrivKeyVisible(false);
        setIsDec(false);
      }, 3500);
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

  // Function to clear the decrypted priv key
  const handleHidePrivKey = () => {
    setDecryptedPrivKey("");
    setIsPrivKeyVisible(false);
    setIsDec(false);
  };

  return {
    decryptedPrivKey,
    isPrivKeyVisible,
    isDec,
    handleDecryptPrivKey,
    handleHidePrivKey,
  };
}
