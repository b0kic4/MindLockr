import React from "react";
import { DecryptPrivKey } from "@wailsjs/go/keys/PubPrvKeyGen.js";
import { LogError } from "@wailsjs/runtime/runtime.js";
import { toast } from "@/hooks/use-toast.js";

export function usePrivateKeyDecryption() {
  const [decryptedPrivKey, setDecryptedPrivKey] = React.useState<string>("");
  const [isPrivKeyVisible, setIsPrivKeyVisible] =
    React.useState<boolean>(false);

  const handleDecryptPrivKey = async (passphrase: string) => {
    try {
      const decrypted = await DecryptPrivKey(passphrase);
      setDecryptedPrivKey(decrypted);
      setIsPrivKeyVisible(true);

      // Hide the decrypted private key after 50 seconds
      setTimeout(() => {
        setDecryptedPrivKey("");
        setIsPrivKeyVisible(false);
      }, 50000);
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
