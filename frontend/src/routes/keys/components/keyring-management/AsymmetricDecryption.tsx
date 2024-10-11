import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import useSelectedAsymmetricFileStore from "@/lib/store/useSelectAsymmetricFile";
import { LogError, LogInfo } from "@wailsjs/runtime/runtime";
import { DecryptPassphrase } from "@wailsjs/go/hybriddecryption/HybridPassphraseDecryption";
import { LoadAsymmetricEnData } from "@wailsjs/go/keys/KeyRetrieve";
import { PacmanLoader } from "react-spinners";

const PassphraseFormDecryption = () => {
  const [privKey, setPrivKey] = React.useState<string>("");
  const [decryptedPassphrase, setDecryptedPassphrase] =
    React.useState<string>("");

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { selectedFile } = useSelectedAsymmetricFileStore();
  const { toast } = useToast();

  const handlePrivateKeyChange = (key: string) => {
    const cleanedPrivKey = key
      .replace(/-----BEGIN EC PRIVATE KEY-----/g, "")
      .replace(/-----END EC PRIVATE KEY-----/g, "")
      .replace(/\s+/g, "")
      .trim();
    setPrivKey(cleanedPrivKey);
  };

  const handleDecrypt = async () => {
    if (!selectedFile) return;

    try {
      setIsLoading(true);
      const loadedPassphraseFromFS = await LoadAsymmetricEnData(
        selectedFile.path,
      );
      if (!loadedPassphraseFromFS)
        return toast({
          variant: "destructive",
          className: "bg-red-500 border-0",
          title: "Uh oh! Something went wrong.",
          description: "Selected File not found in file system",
        });

      const decryptedPassphrase = await DecryptPassphrase(
        loadedPassphraseFromFS,
        privKey,
      );
      setDecryptedPassphrase(decryptedPassphrase);
    } catch (error) {
      setIsLoading(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : JSON.stringify(error);
      LogError(errorMessage);
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Decryption failed",
        description: "Please check your private key or passphrase.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-background dark:bg-background-dark rounded-md shadow-md space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        Perform decryption with recipient's private key
      </h3>
      <p className="text-sm text-foreground dark:text-foreground-dark text-center mb-4">
        File: {selectedFile && selectedFile.name}
      </p>
      <Input
        value={privKey}
        onChange={(e) => handlePrivateKeyChange(e.target.value)}
        type="password"
        placeholder="Enter recipient's private key"
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-foreground"
      />
      <Button
        onClick={handleDecrypt}
        variant="secondary"
        className="w-full text-foreground"
      >
        {isLoading ? <PacmanLoader size={8} color="#fff" /> : "Decrypt"}
      </Button>
      {decryptedPassphrase && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner">
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Decrypted Passphrase
          </h4>
          <p className="text-lg font-mono text-purple-600 dark:text-purple-400 break-words">
            {decryptedPassphrase}
          </p>
        </div>
      )}
    </div>
  );
};

const SignatureFormValidation = () => {
  return (
    <div className="p-4 bg-card dark:bg-card-dark rounded-md shadow-md">
      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Provide the sender’s public key to validate the signature.
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
        This process will verify the authenticity of the data.
      </p>
    </div>
  );
};

const SymmetricDataDecryptionForm = () => {
  return (
    <div className="p-4 bg-card dark:bg-card-dark rounded-md shadow-md">
      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Decrypt the data using the passphrase.
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
        Ensure that you have successfully decrypted the passphrase before
        proceeding.
      </p>
    </div>
  );
};

const RenderContent = () => {
  const { selectedFile } = useSelectedAsymmetricFileStore();

  if (!selectedFile) return null;

  let contentText: string;
  let contentComponent: JSX.Element;

  switch (selectedFile.type) {
    case "Key File":
      contentText = "Decrypt Passphrase";
      contentComponent = <PassphraseFormDecryption />;
      break;
    case "Signature File":
      contentText = "Validate Data";
      contentComponent = <SignatureFormValidation />;
      break;
    case "Encrypted Data":
      contentText = "Decrypt Data with Passphrase";
      contentComponent = <SymmetricDataDecryptionForm />;
      break;
    default:
      contentText = "Unsupported file type.";
      contentComponent = <div>Unsupported file type.</div>;
      break;
  }

  return (
    <div className="space-y-4 text-center">
      <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
        {contentText}
      </h2>
      {contentComponent}
    </div>
  );
};

export default function AsymmetricDecryption() {
  return (
    <div className="flex w-full justify-center gap-2 p-4">
      <RenderContent />
    </div>
  );
}
