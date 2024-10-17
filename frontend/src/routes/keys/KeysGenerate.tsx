import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGenKey } from "@/hooks/keys/useGenKey";
import { useSaveKey } from "@/hooks/keys/useSaveKey";
import { useToast } from "@/hooks/use-toast";
import usePubPrivAsymmetricEncryptionInputsStore from "@/lib/store/useAsymmetricEncryptionPrivPubKeysProvided";
import { EncryptSharedData } from "@wailsjs/go/hybridencryption/HybridEncryption";
import { hybridencryption } from "@wailsjs/go/models";
import { LogError } from "@wailsjs/runtime/runtime";
import React from "react";
import AlgorithmSelector from "./components/key-gen/AlgorithmSelector";
import AsymmetricKeyEncryptionForm from "./components/key-gen/AsymmetricEncryptionForm";
import EncryptedDataDisplay from "./components/key-gen/EncryptedDataDisplay";
import EncryptionForm from "./components/key-gen/EncryptionForm";
import KeySaveForm from "./components/key-gen/KeySaveForm";
import KeyTypeTabs from "./components/key-gen/KeyTypeTabs";
import Questions from "./components/key-gen/Questions";

export default function KeysGen() {
  // data for encryption (symmetric)
  const [data, setData] = React.useState("");
  const [passphrase, setPassphrase] = React.useState("");
  const [algorithm, setAlgorithm] = React.useState("AES");
  const [algorithmType, setAlgorithmType] = React.useState<string>("");

  // utils for encryption (asymmetric)
  const [folderName, setFolderName] = React.useState<string>("");

  // encrypted string
  const [encryptedData, setEncryptedData] = React.useState("");

  // keyinfo
  const [keyType, setKeyType] = React.useState("symmetric");
  const [keyFileName, setKeyFileName] = React.useState("");

  // hooks
  const { generateKey, result, error } = useGenKey();
  const { saveKey, errorWhenSaving } = useSaveKey();
  const { toast } = useToast();

  // zustand
  const { providedPubKey, providedPrivKey } =
    usePubPrivAsymmetricEncryptionInputsStore();

  // effect to update encrypted data asap
  React.useEffect(() => {
    if (result) setEncryptedData(result);
  }, [result]);

  const handleGenerateKey = async () => {
    const requestData = {
      data,
      passphrase,
      algorithm,
      algorithmType,
    };

    await generateKey(requestData);

    if (error) {
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Key Generation Failed",
        description: error,
      });
    } else {
      setEncryptedData(result as any);
      toast({
        variant: "default",
        className: "border-0",
        title: "Key Generated Successfully",
        description: "Your key has been generated.",
      });
    }
  };

  // adding now RSA
  const handleGenerateSharableData = async () => {
    const missingFields = [];

    if (!data) missingFields.push("Data");
    if (!passphrase) missingFields.push("Passphrase");
    if (!algorithm) missingFields.push("Algorithm");
    if (!algorithmType) missingFields.push("Algorithm Type");
    if (!folderName) missingFields.push("Folder Name");
    if (!providedPubKey) missingFields.push("Public Key");
    if (!providedPrivKey) missingFields.push("Private Key");

    if (missingFields.length > 0) {
      missingFields.forEach((field) => {
        toast({
          variant: "destructive",
          className: "bg-red-500 border-0",
          title: `Missing Field: ${field}`,
          description: `Please provide a value for ${field}.`,
        });
      });
      return;
    }

    const reqData: hybridencryption.RequestData = {
      data,
      passphrase,
      algorithm,
      algorithmType,
      folderName,
      pubKey: providedPubKey,
      privKey: providedPrivKey,
    };

    try {
      const response: hybridencryption.ResponseData =
        await EncryptSharedData(reqData);
      setEncryptedData(response.SymmetricData);

      toast({
        variant: "default",
        title: "Encryption Successful",
        description: "Your data and passphrase have been encrypted.",
      });
    } catch (error) {
      // Log the entire error object for debugging
      console.error("Raw error object:", error);
      LogError("Hybrid Encryption failed: " + JSON.stringify(error));

      // Handle known error structures
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : JSON.stringify(error);

      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Encryption Failed",
        description:
          errorMessage || "An unknown error occurred during encryption.",
      });
    } finally {
      setFolderName("");
      setData("");
      setPassphrase("");
    }
  };

  const handleSaveKey = async () => {
    await saveKey(keyFileName, encryptedData, algorithmType);

    if (!errorWhenSaving) {
      setData("");
      setPassphrase("");
      setAlgorithm("AES");
      setKeyFileName("");
      setEncryptedData("");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 rounded-lg">
      <h2 className="text-2xl font-semibold">Key Generation & Encryption</h2>

      <Questions />

      <KeyTypeTabs keyType={keyType} setKeyType={setKeyType}>
        {keyType === "asymmetric" && (
          <div className="p-4 bg-muted dark:bg-muted-dark rounded-lg mb-4">
            <p className="text-md text-purple-700 dark:text-purple-500 text-center">
              <strong>Note:</strong> You’ll use symmetric encryption for the
              actual data and the passphrase. Then, you’ll encrypt that
              passphrase using the asymmetric algorithm specified below to
              securely share both the encrypted data and the passphrase.
            </p>
          </div>
        )}

        <div className="flex flex-col">
          <div className="space-y-2">
            {keyType === "asymmetric" && (
              <Input
                id="folderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Specify the folder name to store data"
                className="mb-2 bg-card dark:bg-muted-dark text-foreground dark:text-foreground-dark"
              />
            )}
            <EncryptionForm
              data={data}
              setData={setData}
              passphrase={passphrase}
              setPassphrase={setPassphrase}
            />

            <AlgorithmSelector
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              algorithmType={algorithmType}
              setAlgorithmType={setAlgorithmType}
            />
          </div>

          {keyType === "asymmetric" && <AsymmetricKeyEncryptionForm />}
        </div>
      </KeyTypeTabs>

      {keyType == "symmetric" && (
        <Button
          onClick={handleGenerateKey}
          className="bg-blue-500 text-white p-3 rounded w-full"
        >
          Encrypt Data with Symmetric Key
        </Button>
      )}

      {keyType == "asymmetric" && (
        <Button
          onClick={handleGenerateSharableData}
          className="bg-blue-500 text-white p-3 rounded w-full"
        >
          Generate Sharable Encryption
        </Button>
      )}

      {keyType == "symmetric" && (
        <EncryptedDataDisplay encryptedData={encryptedData} />
      )}

      {encryptedData && keyType == "symmetric" && (
        <KeySaveForm
          keyFileName={keyFileName}
          setKeyFileName={setKeyFileName}
          handleSaveKey={handleSaveKey}
        />
      )}
    </div>
  );
}
