import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGenKey } from "@/hooks/keys/useGenKey";
import { useSaveKey } from "@/hooks/keys/useSaveKey";
import { useToast } from "@/hooks/use-toast";
import usePubPrivStore from "@/lib/store/usePubPrivStore";
import { LogInfo } from "@wailsjs/runtime/runtime";
import React from "react";
import AlgorithmSelector from "./components/key-gen/AlgorithmSelector";
import AsymmetricKeyEncryptionForm from "./components/key-gen/AsymmetricEncryptionForm";
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
  const { setPrivKey, setPubKey, clearKeys, privKey, pubKey } =
    usePubPrivStore();

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

  // user provids data, passphrase, selects the alg
  // there should be a state that holds the pub and priv
  // key provided for the encryption
  //
  // than we are sending that data to Go
  // go stores the data HOW????

  // maybe to have an input that reads for the folder name
  // and then we have the structure in the fs:
  // /keys/asymmetric -> (name of the folder)
  // -> 1. encrypted data 2. encrypted sharable key

  // for MVP we should have only ECC
  // later add RSA and DSA

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
                placeholder="Specify the folder name to store data"
                className="bg-muted dark:bg-muted-dark"
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
