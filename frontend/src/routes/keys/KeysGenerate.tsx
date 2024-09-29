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

export default function KeysGen() {
  const [data, setData] = React.useState("");
  const [passphrase, setPassphrase] = React.useState("");
  const [algorithm, setAlgorithm] = React.useState("AES");
  const [encryptedData, setEncryptedData] = React.useState("");

  // Simulate key generation and encryption logic
  const handleGenerateKey = async () => {};

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Key Generation</h2>

      {/* Input for Data */}
      <div className="flex mb-4 gap-2">
        <Input
          type="text"
          placeholder="Data to be encrypted"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Passphrase for Decryption"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
        />
      </div>

      {/* Select Algorithm */}
      <div className="mb-4">
        <Select value={algorithm} onValueChange={setAlgorithm}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select encryption algorithm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AES">AES</SelectItem>
            <SelectItem value="RSA">RSA</SelectItem>
            <SelectItem value="ChaCha20">ChaCha20</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Generate Button */}
      <Button onClick={handleGenerateKey} className="w-full">
        Generate Key
      </Button>

      {/* Display Encrypted Data */}
      {encryptedData && (
        <div className="mt-4 p-4 bg-background dark:bg-dark-bg rounded">
          <h3 className="text-lg font-semibold">Encrypted Data:</h3>
          <p className="text-sm break-all">{encryptedData}</p>
        </div>
      )}
    </div>
  );
}
