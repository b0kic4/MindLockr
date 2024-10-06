import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useGenKey } from "@/hooks/useGenKey";
import { useSaveKey } from "@/hooks/useSaveKey";
import React from "react";
import AlgorithmSelector from "./components/key-gen/AlgorithmSelector";
import EncryptedDataDisplay from "./components/key-gen/EncryptedDataDisplay";
import EncryptionForm from "./components/key-gen/EncryptionForm";
import KeySaveForm from "./components/key-gen/KeySaveForm";
import KeyTypeTabs from "./components/key-gen/KeyTypeTabs";
import Questions from "./components/key-gen/Questions";

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

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 rounded-lg">
      <h2 className="text-2xl font-semibold">Key Generation & Encryption</h2>

      <Questions />

      <KeyTypeTabs keyType={keyType} setKeyType={setKeyType}>
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
      </KeyTypeTabs>

      <Button
        onClick={handleGenerateKey}
        className="bg-blue-500 text-white p-3 rounded w-full"
      >
        {keyType === "symmetric"
          ? "Encrypt Data with Symmetric Key"
          : keyType === "asymmetric"
            ? "Generate Public/Private Key Pair"
            : "Use Hybrid"}
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
