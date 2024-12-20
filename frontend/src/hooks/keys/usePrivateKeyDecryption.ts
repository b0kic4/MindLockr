import { DecryptPgpPrivKey } from "@wailsjs/go/pgpdec/PgpDec";
import { LogError, LogInfo } from "@wailsjs/runtime/runtime.js";
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

  const handleDecryptPrivKey = async (passphrase: string): Promise<boolean> => {
    try {
      const decrypted = await DecryptPgpPrivKey(passphrase, keyPath);
      setDecryptedPrivKey(decrypted);
      setIsPrivKeyVisible(true);
      setIsDec(true);

      setTimeout(() => {
        setDecryptedPrivKey("");
        setIsPrivKeyVisible(false);
        setIsDec(false);
      }, 5000);

      return true;
    } catch (error) {
      LogError(error as any);
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Uh oh! Something went wrong.",
        description:
          "Error decrypting the private key. Please check the passphrase provided",
      });
      return false;
    }
  };

  const handleDecryptReturnPassphrase = async (
    passphrase: string,
  ): Promise<string> => {
    try {
      const decrypted = await DecryptPgpPrivKey(passphrase, keyPath);
      setDecryptedPrivKey(decrypted);
      setIsPrivKeyVisible(true);
      setIsDec(true);

      setTimeout(() => {
        setDecryptedPrivKey("");
        setIsPrivKeyVisible(false);
        setIsDec(false);
      }, 5000);

      return passphrase;
    } catch (error) {
      LogError(error as any);
      toast({
        variant: "destructive",
        className:
          "bg-red-500 border-0 top-0 right-0 data-[state=closed]:slide-out-to-right-full",
        title: "Uh oh! Something went wrong.",
        description:
          "Error decrypting the private key. Please check the passphrase provided",
      });
      return "";
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
    handleDecryptReturnPassphrase,
  };
}
