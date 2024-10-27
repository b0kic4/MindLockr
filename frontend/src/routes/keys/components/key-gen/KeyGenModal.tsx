import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useGenKey } from "@/hooks/keys/useGenKey";
import { useSaveKey } from "@/hooks/keys/useSaveKey";
import { Input } from "@/components/ui/input";
import EncryptedDataDisplay from "./EncryptedDataDisplay";
import AsymmetricKeyEncryptionForm from "./forms/AsymmetricEncryptionForm";
import EncryptionForm from "./forms/EncryptionForm";
import KeySaveForm from "./forms/KeySaveForm";
import AlgorithmSelector from "./utils/AlgorithmSelector";
import KeyTypeTabs from "./utils/KeyTypeTabs";
import Questions from "./utils/Questions";
import { usePrivateKeyDecryption } from "@/hooks/keys/usePrivateKeyDecryption";
import usePgpAsymmetricEncryptionInputsStore from "@/lib/store/useAsymmetricEncryptionPrivPubKeysProvided";
import { EncryptSharedData } from "@wailsjs/go/hybridencryption/HybridEncryption";
import { hybridencryption } from "@wailsjs/go/models";
import { LogError } from "@wailsjs/runtime/runtime";

export default function KeysGenModal() {
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
  const {
    selectedPgpKeyPair,
    providedPubKey,
    providedPrivKey,
    clearEnKey,
    clearPriv,
    clearPub,
    clearPair,
  } = usePgpAsymmetricEncryptionInputsStore();

  const { handleHidePrivKey } = usePrivateKeyDecryption({
    keyPath: selectedPgpKeyPair,
  });

  // effect to update encrypted data asap
  React.useEffect(() => {
    if (result) setEncryptedData(result);
  }, [result]);

  // symmetric encryption
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

  // hybrid encryption
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
      handleHidePrivKey();
      clearPub(), clearPriv(), clearPair(), clearEnKey();
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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 shadow-lg transition-all"
          variant="default"
        >
          + Add New Key / Encrypt New Message
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Key Generation & Encryption</DialogTitle>
          <DialogDescription>
            Please provide the necessary information for encryption.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="space-y-6 overflow-auto max-h-[70vh] p-4">
          <Questions />

          <KeyTypeTabs keyType={keyType} setKeyType={setKeyType}>
            <div className="flex flex-col space-y-2">
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
              {keyType === "asymmetric" && <AsymmetricKeyEncryptionForm />}
            </div>
          </KeyTypeTabs>

          {keyType === "symmetric" && (
            <EncryptedDataDisplay encryptedData={encryptedData} />
          )}

          {encryptedData && keyType === "symmetric" && (
            <KeySaveForm
              keyFileName={keyFileName}
              setKeyFileName={setKeyFileName}
              handleSaveKey={handleSaveKey}
            />
          )}
        </div>

        <DialogFooter>
          {keyType === "symmetric" && (
            <Button
              onClick={handleGenerateKey}
              className="bg-blue-600 text-white p-3 rounded w-full"
            >
              Encrypt Data with Symmetric Key
            </Button>
          )}

          {keyType === "asymmetric" && (
            <Button
              onClick={handleGenerateSharableData}
              className="bg-blue-500 text-white p-3 rounded w-full"
            >
              Generate Sharable Encryption
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
