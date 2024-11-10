import { Button } from "@/components/ui/button";
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
import { SaveHybEn } from "@wailsjs/go/en/KeyStore";
import { EncryptAndSign } from "@wailsjs/go/hybenc/HybEnc";
import { en, hybenc } from "@wailsjs/go/models";
import { LogError } from "@wailsjs/runtime/runtime";
import React from "react";
import EncryptedDataDisplay from "./EncryptedDataDisplay";
import AsymmetricKeyEncryptionForm from "./forms/AsymmetricEncryptionForm";
import EncryptionForm from "./forms/EncryptionForm";
import KeySaveForm from "./forms/KeySaveForm";
import KeyTypeTabs from "./utils/KeyTypeTabs";
import Questions from "./utils/Questions";

interface Props {
  fetchKeys: () => Promise<void>;
}

export default function KeysGenModal({ fetchKeys }: Props) {
  const [data, setData] = React.useState("");
  const [passphrase, setPassphrase] = React.useState("");
  const [privKeyPassphrase, setPrivKeyPassphrase] = React.useState<string>("");
  const [algorithm, setAlgorithm] = React.useState("AES");
  const [encryptedData, setEncryptedData] = React.useState("");
  const [keyType, setKeyType] = React.useState("symmetric");
  const [keyFileName, setKeyFileName] = React.useState("");

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

  const handleSaveHybEn = async () => {
    if (!encryptedData) {
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Save Failed",
        description: "No encrypted data available to save.",
      });
      return;
    }

    const req: en.HybridRequestData = {
      FileName: keyFileName,
      MsgArmor: encryptedData,
    };

    try {
      await SaveHybEn(req);

      toast({
        variant: "default",
        title: "Message Saved Successfully",
        description: `Your encrypted message has been saved to the folder: ${req.FileName}`,
      });
    } catch (error) {
      LogError("Saving encrypted message failed: " + JSON.stringify(error));
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Save Failed",
        description: errorMessage,
      });
    }
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

  const encryptedDataRef = React.useRef<any | null>(null);

  React.useEffect(() => {
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

            {encryptedData && (
              <div ref={encryptedDataRef}>
                <KeySaveForm
                  keyFileName={keyFileName}
                  setKeyFileName={setKeyFileName}
                  handleSaveKey={
                    keyType == "symmetric" ? handleSaveKey : handleSaveHybEn
                  }
                />
              </div>
            )}
          </div>
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
