import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { EncryptAES } from "../../../wailsjs/go/cryptography/Cryptography";

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
// Hybrid Encryption: For large data, you can use a hybrid encryption approach where a symmetric key (e.g., AES) is used to encrypt the data, and the symmetric key is encrypted with the public key.

// tabs for user to choose the type of encryption method needed

// +-----------------------------------------------------+
// | Key Generation                                      |
// +-----------------------------------------------------+
// | [Form Fields]                | [Live Key Preview]  |
// | Key Type (Dropdown)           | Algorithm: RSA      |
// | Key Size (Dropdown)           | Key Size: 4096 bits |
// | Expiration Date (Picker)      | Usage: Signing, Enc |
// | Usage Flags (Checkbox)        | Expiration: 1 year  |
// | -----------------------------|---------------------|
// |          [Generate Key Button]                      |
// +-----------------------------------------------------+

type GenerateKeyDataRequest = {
  data: string;
  passphrase: string;
  algorithm: string;
};

export default function KeysGen() {
  const [data, setData] = React.useState<string>("");
  const [passphrase, setPassphrase] = React.useState("");
  const [algorithm, setAlgorithm] = React.useState("AES");
  const [encryptedData, setEncryptedData] = React.useState("");

  // Call Go backend for encryption
  const handleGenerateKey = async () => {
    const requestData: GenerateKeyDataRequest = {
      data,
      passphrase,
      algorithm,
    };

    try {
      const encrypted = await EncryptAES(requestData);
      console.log("Encrypted Data:", encrypted); // Log the encrypted result from Go
      setEncryptedData(encrypted); // Display the encrypted result
    } catch (error) {
      console.error("Encryption failed:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Key Generation</h2>

      {/* Input for Data */}
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="Data to be encrypted"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Passphrase for Encryption"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Select Algorithm */}
      <div className="mb-4">
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="AES">AES</option>
          <option value="RSA">RSA</option>
          <option value="ChaCha20">ChaCha20</option>
        </select>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerateKey}
        className="bg-blue-500 text-white p-2 rounded w-full"
      >
        Generate Key
      </button>

      {/* Display Encrypted Data */}
      {encryptedData && (
        <div className="mt-4 p-4 bg-gray-200 dark:bg-gray-700 rounded">
          <h3 className="text-lg font-semibold">Encrypted Data:</h3>
          <p className="text-sm break-all">{encryptedData}</p>
        </div>
      )}
    </div>
  );
}
