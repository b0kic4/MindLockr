import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGenKey } from "@/hooks/keys/useGenKey";
import { usePrivateKeyDecryption } from "@/hooks/keys/usePrivateKeyDecryption";
import { useSaveKey } from "@/hooks/keys/useSaveEn";
import { useToast } from "@/hooks/use-toast";
import usePgpAsymmetricEncryptionInputsStore from "@/lib/store/useAsymmetricEncryptionPrivPubKeysProvided";
import { EncryptAndSign } from "@wailsjs/go/hybenc/HybEnc";
import { hybenc } from "@wailsjs/go/models";
import { LogError } from "@wailsjs/runtime/runtime";
import React from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
import EncryptedDataDisplay from "./EncryptedDataDisplay";
import AsymmetricKeyEncryptionForm from "./forms/AsymmetricEncryptionForm";
import EncryptionForm from "./forms/EncryptionForm";
import KeySaveForm from "./forms/KeySaveForm";
import KeyTypeTabs from "./utils/KeyTypeTabs";
import Questions from "./utils/Questions";

interface Props {
  fetchKeys: () => Promise<void>;
}

// Maybe to tansform the component to be the
// Sheet

export default function KeysGenModal({ fetchKeys }: Props) {
  const [data, setData] = React.useState("");
  const [passphrase, setPassphrase] = React.useState("");
  const [privKeyPassphrase, setPrivKeyPassphrase] = React.useState<string>("");
  const [algorithm, setAlgorithm] = React.useState("AES");
  const [folderName, setFolderName] = React.useState<string>("");
  const [encryptedData, setEncryptedData] = React.useState("");
  const [keyType, setKeyType] = React.useState("symmetric");
  const [keyFileName, setKeyFileName] = React.useState("");
  const [copied, setCopied] = React.useState<boolean>(false);

  const { generateKey, result, error } = useGenKey();
  const { saveKey, errorWhenSaving } = useSaveKey();
  const { toast } = useToast();

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

  React.useEffect(() => {
    if (result) setEncryptedData(result);
  }, [result]);

  const handleGenerateKey = async () => {
    const requestData = { data, passphrase, algorithm };
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

  const handleGenerateSharableData = async () => {
    const missingFields = [];

    if (!data) missingFields.push("Data");
    if (!passphrase) missingFields.push("Passphrase");
    if (!privKeyPassphrase) missingFields.push("Private Key Passphrase");
    if (!algorithm) missingFields.push("Algorithm");
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

    const reqData: hybenc.RequestData = {
      data,
      passphrase,
      privPassphrase: privKeyPassphrase,
      folderName,
      pubKey: providedPubKey,
      privKey: providedPrivKey,
    };

    try {
      const response: string = await EncryptAndSign(reqData);
      setEncryptedData(response);

      toast({
        variant: "default",
        title: "Encryption Successful",
        description: "Your data and passphrase have been encrypted.",
      });
    } catch (error) {
      LogError("Hybrid Encryption failed: " + JSON.stringify(error));
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
      setPrivKeyPassphrase("");
      clearPub(), clearPriv(), clearPair(), clearEnKey();
    }
  };

  const handleSaveKey = async () => {
    await saveKey(keyFileName, encryptedData);

    if (!errorWhenSaving) {
      setData("");
      setPassphrase("");
      setAlgorithm("AES");
      setKeyFileName("");
      setEncryptedData("");
    }

    await fetchKeys();
  };

  const clearEn = () => {
    setData("");
    setPassphrase("");
    setAlgorithm("AES");
    setKeyFileName("");
    setEncryptedData("");
    handleHidePrivKey();
    clearPub(), clearPriv(), clearPair(), clearEnKey();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(encryptedData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encryptedDataRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    // Auto-focus encrypted message if available
    if (encryptedData) {
      encryptedDataRef.current?.scrollIntoView({ behavior: "smooth" });
      encryptedDataRef.current?.focus();
    }
  }, [encryptedData]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 shadow-lg transition-all">
          Encrypt New Message
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg md:max-w-xl lg:max-w-3xl overflow-y-auto bg-secondary dark:bg-secondary-dark text-black dark:text-gray-200">
        <SheetHeader>
          <SheetTitle className="dark:text-white text-black">
            Message Encryption
          </SheetTitle>
          <SheetDescription>
            Please provide the necessary information for encryption.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 overflow-auto p-4">
          <Questions />
          <KeyTypeTabs keyType={keyType} setKeyType={setKeyType}>
            <div className="flex flex-col space-y-2">
              {keyType === "asymmetric" && (
                <div className="flex flex-col items-start justify-start space-y-1 mt-4">
                  <label
                    htmlFor="publicKey"
                    className="block text-sm font-medium text-foreground dark:text-foreground-dark"
                  >
                    Specify the Foler where the Message will be saved (optional)
                  </label>
                  <Input
                    id="folderName"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    className="mb-2 bg-card dark:bg-muted-dark text-foreground dark:text-foreground-dark"
                    placeholder="Specify the folder name to store data"
                  />
                </div>
              )}
              <EncryptionForm
                data={data}
                setData={setData}
                passphrase={passphrase}
                setPassphrase={setPassphrase}
              />
              {keyType === "asymmetric" && (
                <AsymmetricKeyEncryptionForm
                  setPrivKeyPassphrase={setPrivKeyPassphrase}
                />
              )}
            </div>
          </KeyTypeTabs>

          <div>
            <Button
              onClick={clearEn}
              className="flex font-bold"
              variant={"ghost"}
            >
              Clear
            </Button>
            <EncryptedDataDisplay encryptedData={encryptedData} />
          </div>

          {keyType === "symmetric" && (
            <Button
              onClick={clearEn}
              variant="link"
              className="flex underline text-blue-500"
            >
              Clear
            </Button>
          )}

          {encryptedData && keyType == "symmetric" && (
            <KeySaveForm
              keyFileName={keyFileName}
              setKeyFileName={setKeyFileName}
              handleSaveKey={handleSaveKey}
            />
          )}
        </div>

        <SheetFooter>
          <Button
            onClick={
              keyType === "symmetric"
                ? handleGenerateKey
                : handleGenerateSharableData
            }
            disabled={!data || !passphrase}
            className="bg-blue-600 text-white p-3 rounded w-full"
          >
            {keyType === "symmetric"
              ? "Encrypt Data with Symmetric Key"
              : "Generate Sharable Data"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
