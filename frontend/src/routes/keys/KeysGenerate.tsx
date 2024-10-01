import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import { EncryptAES } from "../../../wailsjs/go/encryption/Cryptography.js";
import AlgorithmTypeDescription from "./components/AlgorithmTypeDescription";
import Questions from "./components/Questions";

// one encryption for sending the data to other people
// one encryption for saving their own data

// if the file is too big or smth
// we can use like encryption with one key
// but sending that key to the other person
// to be with private and public key

// generating private/public key

// user needs to select the usage for the key
// storing, sharing

// encrypting desired data

// symmetric, asymmetric, and hashing
// symmetric (AES, DES, TDEA) -> saving the data with passphrase encryption
// asymmetric (RSA, DSS, DSA, ECC) -> public/private key encryption
// hashing -> unique signature of fixed length (used for verifiying)

// encryption is used to convert data into ciphertext
// by using encryption key the encrypted data can be
// decrypted with decryption key

// RSA Encryption: Widely used for both encryption and digital signatures. Recommended for general use.
// ECC Encryption: Suitable for smaller, more efficient encryption, especially on mobile devices or systems with limited resources.
// Signing: Use the private key to sign data, which can be verified with the public key. This proves the authenticity of the data.
// Hybrid Encryption: For large data, you can use a hybrid encryption approach where a symmetric key (e.g., AES) is used to encrypt the data,
// and the symmetric key is encrypted with the public key.

// tabs for user to choose the type of encryption method needed

// +-----------------------------------------------------+
// | Key Generation                                      |
// +-----------------------------------------------------+
// | [Form Fields]                 | [Live Key Preview]  |
// | Key Type (Dropdown)           | Algorithm: RSA      |
// | Key Size (Dropdown)           | Key Size: 4096 bits |
// | Expiration Date (Picker)      | Usage: Signing, Enc |
// | Usage Flags (Checkbox)        | Expiration: 1 year  |
// | -----------------------------|---------------------|
// |          [Generate Key Button]                      |
// +-----------------------------------------------------+

// add a generate private and public key
// (and make the important note which should be shared)

// also make if in file registry there is public and private key
// for user not to be able to create more of them

// so the key gen needs to have:
// 1. private/public key generation
// 2. sensitive information encryption in key with passphrase decryption
// like passwords, location, codes and etc
// 3. PGP asymmetric keys encryption:
// storing the secure information with public/private key access

// so there should be a tabs bar that will show symmetric and asymmetric
// encryption when clicked on each it will explain to the user
// what it is doing and how should they use it

// we should have an option for careating new public private keys
// for specific encryption or just using the one generated at the start

type GenerateKeyDataRequest = {
  data: string;
  passphrase: string;
  algorithm: string;
  algorithmType: string;
};

export default function KeysGen() {
  const [data, setData] = React.useState("");
  const [passphrase, setPassphrase] = React.useState("");
  const [algorithm, setAlgorithm] = React.useState("AES");
  const [algorithmType, setAlgorithmType] = React.useState<string>("");
  const [encryptedData, setEncryptedData] = React.useState("");
  const [keyType, setKeyType] = React.useState("symmetric");
  const [toggleQuestions, setToggleQuestions] = React.useState<boolean>(false);
  const { toast } = useToast();

  const toggleShowQuestions = () => {
    setToggleQuestions((prevState) => !prevState);
  };

  const handleGenerateKey = async () => {
    const isASCII = (str: string) => /^[\x00-\x7F]*$/.test(str);

    if (!data || !passphrase) {
      alert("Please provide data and passphrase");
      toast({
        variant: "default",
        className: "bg-red-500 border-0",
        title: "Uh oh! Something went wrong.",
        description: "Please provide data and passphrase",
      });
      return;
    }

    if (!isASCII(data) || !isASCII(passphrase)) {
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Uh oh! Something went wrong.",
        description:
          "Please only use ASCII type characters where 1 character = 1 byte",
      });
      return;
    }

    const requestData: GenerateKeyDataRequest = {
      data,
      passphrase,
      algorithm,
      algorithmType,
    };

    try {
      const encrypted = await EncryptAES(requestData);
      console.log("encrypted: ", encrypted);
      setEncryptedData(encrypted);
    } catch (error) {
      console.error("Encryption failed:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-foreground dark:text-foreground-dark">
        Key Generation & Encryption
      </h2>

      {/* Button to Toggle Questions */}
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          onClick={toggleShowQuestions}
          className="flex items-center text-primary dark:text-primary-dark"
        >
          {toggleQuestions ? (
            <>
              Hide Questions <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Show Questions <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {toggleQuestions && (
        <div className="mt-4">
          <Questions />
        </div>
      )}

      <Tabs
        defaultValue="symmetric"
        onValueChange={setKeyType}
        className="w-full mt-6"
      >
        <TabsList className="mb-4 bg-muted dark:bg-muted-dark">
          <TabsTrigger value="symmetric">Symmetric Encryption</TabsTrigger>
          <TabsTrigger value="asymmetric">Asymmetric Encryption</TabsTrigger>
        </TabsList>

        <TabsContent value="symmetric">
          <div className="space-y-4">
            <p className="text-sm text-foreground dark:text-foreground-dark">
              Symmetric encryption uses the same key for encryption and
              decryption. This is ideal for storing sensitive information
              securely.
            </p>
            <Input
              type="text"
              placeholder="Data to be encrypted"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="mb-2 bg-card dark:bg-muted-dark text-foreground dark:text-foreground-dark"
            />
            <Input
              type="text"
              placeholder="Passphrase for Encryption"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="mb-2 bg-card dark:bg-muted-dark text-foreground dark:text-foreground-dark"
            />
            <Select value={algorithm} onValueChange={setAlgorithm}>
              <SelectTrigger className="bg-card dark:bg-muted-dark text-foreground dark:text-foreground-dark">
                <SelectValue placeholder="Select encryption algorithm" />
              </SelectTrigger>
              <SelectContent className="bg-card dark:bg-card-dark text-foreground dark:text-foreground-dark">
                <SelectItem value="AES">AES</SelectItem>
                <SelectItem value="DES">DES</SelectItem>
                <SelectItem value="TDEA">TDEA</SelectItem>
              </SelectContent>
            </Select>
            {algorithm === "AES" && (
              <>
                <Select value={algorithmType} onValueChange={setAlgorithmType}>
                  <SelectTrigger className="bg-card dark:bg-muted-dark text-foreground dark:text-foreground-dark">
                    <SelectValue placeholder="Select AES Encryption Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-card-dark text-foreground dark:text-foreground-dark">
                    <SelectItem value="AES-128">
                      AES - 128 (16 character Passphrase)
                    </SelectItem>
                    <SelectItem value="AES-192">
                      AES - 192 (24 character Passphrase)
                    </SelectItem>
                    <SelectItem value="AES-256">
                      AES - 256 (32 character Passphrase)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <AlgorithmTypeDescription algorithmType={algorithmType} />
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="asymmetric">
          <div className="space-y-4">
            <p className="text-sm text-foreground dark:text-foreground-dark">
              Asymmetric encryption uses a public/private key pair and is
              commonly used for secure sharing of data.
            </p>
            <Input
              type="text"
              placeholder="Data to be encrypted"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="mb-2 bg-card dark:bg-muted-dark text-foreground dark:text-foreground-dark"
            />
            <Input
              type="text"
              placeholder="Public key"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="mb-2 bg-card dark:bg-muted-dark text-foreground dark:text-foreground-dark"
            />
            <Select value={algorithm} onValueChange={setAlgorithm}>
              <SelectTrigger className="bg-card dark:bg-muted-dark text-foreground dark:text-foreground-dark">
                <SelectValue placeholder="Select encryption algorithm" />
              </SelectTrigger>
              <SelectContent className="bg-card dark:bg-card-dark text-foreground dark:text-foreground-dark">
                <SelectItem value="RSA">RSA</SelectItem>
                <SelectItem value="ECC">ECC</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-foreground dark:text-foreground-dark">
              Public key will be used for encryption, while the private key is
              used for decryption. You can securely share your public key with
              others to encrypt data for you.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Generate Key Button */}
      <Button
        onClick={handleGenerateKey}
        className="bg-blue-500 text-white p-3 rounded w-full"
      >
        {keyType === "symmetric"
          ? "Encrypt Data with Symmetric Key"
          : "Generate Public/Private Key Pair"}
      </Button>

      {/* Display Encrypted Data */}
      {encryptedData && (
        <div className="mt-4 p-4 bg-muted dark:bg-muted-dark rounded">
          <h3 className="text-lg font-semibold text-foreground dark:text-foreground-dark">
            Encrypted Data:
          </h3>
          <p className="text-sm break-all text-foreground dark:text-foreground-dark">
            {encryptedData}
          </p>
        </div>
      )}
    </div>
  );
}
