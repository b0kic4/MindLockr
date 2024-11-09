import React from "react";
import { EncryptAES } from "../../../wailsjs/go/symmetricencryption/Cryptography";
import { LogError } from "../../../wailsjs/runtime/runtime";
import { useToast } from "../use-toast";

type GenerateKeyDataRequest = {
  data: string;
  passphrase: string;
  algorithm: string;
};

export function useGenKey() {
  const { toast } = useToast();
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<string | null>(null);

  const isASCII = (str: string) => /^[\x00-\x7F]*$/.test(str);

  const generateKey = async (keyProps: GenerateKeyDataRequest) => {
    if (!keyProps.data || !keyProps.passphrase) {
      toast({
        variant: "default",
        className: "bg-red-500 border-0",
        title: "Uh oh! Something went wrong.",
        description: "Please provide data and passphrase",
      });
      setError("Data and passphrase are required");
      return;
    }

    if (!isASCII(keyProps.data) || !isASCII(keyProps.passphrase)) {
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Uh oh! Something went wrong.",
        description:
          "Please only use ASCII type characters where 1 character = 1 byte",
      });
      setError("Non-ASCII characters detected in data or passphrase");
      return;
    }

    try {
      const encryptedResult = await EncryptAES(keyProps);

      if (!encryptedResult) {
        toast({
          variant: "destructive",
          className: "bg-red-500 border-0",
          title: "Uh oh! Something went wrong.",
          description: "Data that should have been encrypted is empty",
        });
        setError("Empty encrypted result");
        return;
      }

      setResult(encryptedResult);
      setError(null);
      return encryptedResult;
    } catch (error) {
      LogError(error as any);
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Uh oh! Something went wrong.",
        description: "Encryption failed for some reason",
      });
      setError("Encryption failed");
    }
  };

  return { generateKey, result, error };
}
