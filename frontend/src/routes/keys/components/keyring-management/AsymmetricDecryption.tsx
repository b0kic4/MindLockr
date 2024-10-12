import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import useSelectedAsymmetricFileStore from "@/lib/store/useSelectAsymmetricFile";
import useLastDecryptedPassphrase from "@/lib/store/useLastDecryptedPassphrase";
import { VerifyData } from "@wailsjs/go/validation/Validatior";
import { LogError, LogInfo } from "@wailsjs/runtime/runtime";
import { DecryptPassphrase } from "@wailsjs/go/hybriddecryption/HybridPassphraseDecryption";
import { LoadAsymmetricEnData } from "@wailsjs/go/keys/KeyRetrieve";
import { PacmanLoader } from "react-spinners";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { DecryptAES } from "@wailsjs/go/symmetricdecryption/Cryptography";

const PassphraseFormDecryption = () => {
  // form inputs
  const [privKey, setPrivKey] = React.useState<string>("");
  const [decryptedPassphrase, setDecryptedPassphrase] =
    React.useState<string>("");

  // utils
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [showDecryptedPassphrase, setShowDecryptedPassphrae] =
    React.useState<boolean>(false);

  // zustand hooks
  const { selectedFile } = useSelectedAsymmetricFileStore();
  const { setPassphrase } = useLastDecryptedPassphrase();

  const handlePrivateKeyChange = (key: string) => {
    const cleanedPrivKey = key
      .replace(/-----BEGIN EC PRIVATE KEY-----/g, "")
      .replace(/-----END EC PRIVATE KEY-----/g, "")
      .replace(/\s+/g, "")
      .trim();
    setPrivKey(cleanedPrivKey);
  };

  // path to be displayed
  const displayPath = selectedFile
    ? selectedFile.path.split("/").slice(-3).join("/")
    : "";

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
      setPassphrase(decryptedPassphrase);

      toast({
        variant: "default",
        className: "bg-green-500 border-0",
        title: "Passphrase Decrypted Successfully",
        description: "The passphrase is saved for one time use only",
      });
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
      <div className="flex flex-col text-foreground dark:text-foreground-dark text-center mb-4">
        <p>File: {selectedFile && selectedFile.name}</p>
        <p>Path: {displayPath}</p>
      </div>
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
          <div className="flex items-center">
            <p className="text-lg font-mono text-purple-600 dark:text-purple-400 break-words">
              {showDecryptedPassphrase ? decryptedPassphrase : "••••••••"}
            </p>
            <button
              onClick={() =>
                setShowDecryptedPassphrae(!showDecryptedPassphrase)
              }
              className="ml-2 focus:outline-none"
              aria-label="Toggle passphrase visibility"
            >
              {showDecryptedPassphrase ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SignatureFormValidation = () => {
  // currently implemeting this

  const { selectedFile } = useSelectedAsymmetricFileStore();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [aesFolderPath, setAesFolderPath] = React.useState<string>("");

  const displayPath = selectedFile
    ? selectedFile.path.split("/").slice(-3).join("/")
    : "";

  LogInfo(displayPath);

  const handleValidate = async () => {
    try {
      if (!selectedFile) return;

      setIsLoading(true);
      // const loadedSymmetricData = await LoadAsymmetricEnData()
      // const loadedValidatioFile = await LoadAsymmetricEnData(selectedFile.path);
      // const response = await VerifyData()
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-card dark:bg-card-dark rounded-md shadow-md">
      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Provide the sender’s public key to validate the signature.
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
        This process will verify the authenticity of the data.
      </p>
      <div className="flex flex-col text-foreground dark:text-foreground-dark text-center mb-4">
        <p>Validation File: {selectedFile && selectedFile.name}</p>
        <p>Symmetric Data: {selectedFile && selectedFile.name}</p>
      </div>
    </div>
  );
};

type DataToDecrypt = {
  encryptedData: string;
  passphrase: string;
};

const SymmetricDataDecryptionForm = () => {
  // form inputs
  const [passphraseInput, setPassphraseInput] = React.useState<string>("");
  const { passphrase, clearLastDecPassphrase } = useLastDecryptedPassphrase();

  // utils
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [decryptedData, setDecryptedData] = React.useState<string>("");
  const [showDecryptedData, setShowDecryptedData] =
    React.useState<boolean>(false);

  // zustand hooks
  const { selectedFile } = useSelectedAsymmetricFileStore();

  // Extracting AES algorithm type dynamically from the path
  const getAlgorithmType = (path: string) => {
    const match = path.match(/AES-(128|192|256)/);
    return match ? match[0] : "Unknown";
  };

  const algorithmType = selectedFile
    ? getAlgorithmType(selectedFile.path)
    : "Unknown";

  // Display path dynamically
  const displayPath = selectedFile
    ? selectedFile.path.split("/").slice(-3).join("/")
    : "";

  const handleDecrypt = async () => {
    try {
      if (!selectedFile) return;
      setIsLoading(true);
      const loadedSymmetricData = await LoadAsymmetricEnData(selectedFile.path);

      const dataToDecrypt: DataToDecrypt = {
        encryptedData: loadedSymmetricData,
        passphrase: passphraseInput,
      };

      const decrypted = await DecryptAES(algorithmType, dataToDecrypt);
      setDecryptedData(decrypted);

      toast({
        variant: "default",
        className: "bg-green-500 border-0",
        title: "Data Decrypted Successfully",
        description: "The data has been decrypted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Decryption failed",
        description: "An error occurred during decryption.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePassphraseChange = (passphrase: string) => {
    setPassphraseInput(passphrase);
  };

  const useLastDecryptedPassphraseInput = () => {
    toast({
      variant: "default",
      className: "bg-green-500 border-0",
      title: "Latest Decrypted Passphrase Retrieved",
      description:
        "Passphrase obtained. For future use, please re-enter the passphrase manually.",
    });

    setPassphraseInput(passphrase);

    clearLastDecPassphrase();
  };

  return (
    <div className="p-6 bg-background dark:bg-background-dark rounded-md shadow-md space-y-4">
      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Decrypt the data using the passphrase.
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
        Ensure that you have successfully decrypted the passphrase before
        proceeding.
      </p>
      <div className="flex flex-col text-foreground dark:text-foreground-dark text-center mb-4">
        <p>File: {selectedFile && selectedFile.name}</p>
        <p>Path: {displayPath}</p>
      </div>
      {passphrase && (
        <Button onClick={useLastDecryptedPassphraseInput}>
          Use Last Decrypted Passphrase
        </Button>
      )}
      <Input
        value={passphraseInput}
        onChange={(e) => handlePassphraseChange(e.target.value)}
        type="password"
        placeholder="Enter decrypted passphrase"
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-foreground"
      />
      <Button
        onClick={handleDecrypt}
        variant="secondary"
        className="w-full text-foreground"
      >
        {isLoading ? <PacmanLoader size={8} color="#fff" /> : "Decrypt"}
      </Button>
      {decryptedData && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner">
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Decrypted Data
          </h4>
          <div className="flex items-center">
            <p className="text-lg font-mono text-purple-600 dark:text-purple-400 break-words">
              {showDecryptedData ? decryptedData : "••••••••"}
            </p>
            <button
              onClick={() => setShowDecryptedData(!showDecryptedData)}
              className="ml-2 focus:outline-none"
              aria-label="Toggle data visibility"
            >
              {showDecryptedData ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
      )}
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