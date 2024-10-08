import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useGenKey } from "@/hooks/keys/useGenKey";
import { useSaveKey } from "@/hooks/keys/useSaveKey";
import React from "react";
import AlgorithmSelector from "./components/key-gen/AlgorithmSelector";
import EncryptedDataDisplay from "./components/key-gen/EncryptedDataDisplay";
import EncryptionForm from "./components/key-gen/EncryptionForm";
import KeySaveForm from "./components/key-gen/KeySaveForm";
import KeyTypeTabs from "./components/key-gen/KeyTypeTabs";
import Questions from "./components/key-gen/Questions";
import { LogInfo } from "@wailsjs/runtime/runtime";
import AsymmetricKeyEncryptionForm from "./components/key-gen/AsymmetricEncryptionForm";

// +-----------------------------------------------------+
// | Key Generation                                      |
// +-----------------------------------------------------+
// | [Form Fields]                 | [Live Key Preview]  |
// | Key Type (Dropdown)           | Algorithm: RSA      |
// | Key Size (Dropdown)           | Key Size: 4096 bits |
// | Expiration Date (Picker)      | Usage: Signing, Enc |
// | Usage Flags (Checkbox)        | Expiration: 1 year  |
// | ------------------------------|---------------------|
// |          [Generate Key Button]                      |
// +-----------------------------------------------------+

export default function KeysGen() {
  // data for encryption
  const [data, setData] = React.useState("");
  const [passphrase, setPassphrase] = React.useState("");
  const [algorithm, setAlgorithm] = React.useState("AES");
  const [algorithmType, setAlgorithmType] = React.useState<string>("");
  const [asymmetricAlg, setAsymmetricAlg] = React.useState<string>("");

  // encrypted string
  const [encryptedData, setEncryptedData] = React.useState("");

  // keyinfo
  const [keyType, setKeyType] = React.useState("symmetric");
  const [keyFileName, setKeyFileName] = React.useState("");

  // hooks
  const { generateKey, result, error } = useGenKey();
  const { saveKey, errorWhenSaving } = useSaveKey();
  const { toast } = useToast();

  // effect to update encrypted data asap
  React.useEffect(() => {
    if (result) setEncryptedData(result);
  }, [result]);

  React.useEffect(() => LogInfo(keyType));

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

  // asymmetric key encryption
  // provide data (text key or any other text)
  // provide passphrase
  // encyrpt passphrase with pub/priv

  // zustand state management

  // for asymmetric section I need to have:
  //
  // 0. passphrase from KeysGen component
  // 1. providing the public key
  // 2. providing the private key

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
          <div>
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

          {keyType === "asymmetric" && (
            <AsymmetricKeyEncryptionForm passphrase={passphrase} />
          )}
        </div>
      </KeyTypeTabs>

      <Button
        onClick={handleGenerateKey}
        className="bg-blue-500 text-white p-3 rounded w-full"
      >
        {keyType === "symmetric"
          ? "Encrypt Data with Symmetric Key"
          : keyType === "asymmetric" && "Generate Encryption"}
      </Button>

      <EncryptedDataDisplay encryptedData={encryptedData} />

      {encryptedData && (
        <KeySaveForm
          keyFileName={keyFileName}
          setKeyFileName={setKeyFileName}
          handleSaveKey={handleSaveKey}
        />
      )}
    </div>
  );
}
