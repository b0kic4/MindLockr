import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Lock, Unlock } from "lucide-react";
import useCipherPgpData from "@/lib/store/cipher/CipherDecrytStore";
import {
  Decrypt,
  DecryptAndValidate,
  ValidateSignature,
} from "@wailsjs/go/hybdec/HybDec";
import { hybdec } from "@wailsjs/go/models";
import { LogInfo } from "@wailsjs/runtime/runtime";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { Label } from "@components/ui/label";

export default function Cipher() {
  // pgp
  const [pgpMessage, setPgpMessage] = React.useState<string>("");
  const [pgpKey, setPgpKey] = React.useState<string>("");

  const [operation, setOperation] = React.useState<
    "decrypt" | "decryptAndValidate" | "validateSignature"
  >("decrypt");

  const [messageInputType, setMessageInputType] = React.useState("text");
  const [keyInputType, setKeyInputType] = React.useState("text");
  const [keyType, setKeyType] = React.useState("public");
  const [passphrase, setPassphrase] = React.useState("");
  const [result, setResult] = React.useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [decryptedData, setDecryptedData] = React.useState<string | null>(null);
  const { setSelectedKey, setSelectedMsg } = useCipherPgpData();

  const handleOperationChange = (
    value: "decrypt" | "decryptAndValidate" | "validateSignature",
  ) => {
    setOperation(value);
  };

  const handleMessageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        setPgpMessage(content);
      };
      reader.readAsText(file);
    }
  };

  const handleKeyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        setPgpKey(content);
      };
      reader.readAsText(file);
    }
  };

  const handleAction = () => {};
  // Handles decryption
  const decryptMessage = async () => {
    try {
      const reqData: hybdec.RequestData = {
        data: pgpMessage,
        privKey: keyType === "private" ? pgpKey : "",
        privPassphrase: passphrase,
        pubKey: keyType === "public" ? pgpKey : "",
      };
      const response = await Decrypt(reqData);
      LogInfo(JSON.stringify(response));
      setResult({ success: true, message: "Message decrypted successfully!" });
      // setDecryptedData(response.data || ""); // Use empty string if no data
    } catch (error) {
      setResult({
        success: false,
        message: `Decryption failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  };

  // Handles decryption with validation
  const decryptAndValidate = async () => {
    try {
      const response: hybdec.ReturnType = await DecryptAndValidate({
        data: pgpMessage,
        privKey: keyType === "private" ? pgpKey : "",
        privPassphrase: passphrase,
        pubKey: keyType === "public" ? pgpKey : "",
      });
      LogInfo(JSON.stringify(response));
      // setResult({
      //   success: response.valid,
      //   message: response.valid
      //     ? "Message decrypted and validated successfully!"
      //     : "Validation failed",
      // });
      // setDecryptedData(response.data || "");
    } catch (error) {
      setResult({
        success: false,
        message: `Decryption and validation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  };

  // Handles signature validation
  const validateSignature = async () => {
    try {
      const isValid = await ValidateSignature({
        data: pgpMessage,
        privKey: keyType === "private" ? pgpKey : "",
        privPassphrase: passphrase,
        pubKey: keyType === "public" ? pgpKey : "",
      });
      LogInfo(JSON.stringify(isValid));
      setResult({
        success: isValid,
        message: isValid
          ? "Signature validated successfully!"
          : "Signature validation failed",
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Signature validation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto bg-background dark:bg-background-dark shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Cipher</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <h3 className="font-semibold">Choose an Operation</h3>
        <RadioGroup
          value={operation}
          onValueChange={handleOperationChange}
          className="flex flex-row justify-center items-center text-center"
        >
          <RadioGroupItem value="decrypt" id="decrypt" />
          <Label htmlFor="decrypt">Decrypt</Label>
          <RadioGroupItem value="decryptAndValidate" id="decryptAndValidate" />
          <Label htmlFor="decryptAndValidate">
            Decrypt and Validate Signature
          </Label>
          <RadioGroupItem value="validateSignature" id="validateSignature" />
          <Label htmlFor="validateSignature">Validate Signature</Label>
        </RadioGroup>

        <div className="flex justify-center my-6">
          <div className="w-1/2 border-t border-gray-300" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PGP Message Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">PGP Message</h2>
            <div className="space-y-2">
              <Label>Input Method</Label>
              <RadioGroup
                defaultValue="text"
                onValueChange={setMessageInputType}
                className="flex items-center justify-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="text-message" />
                  <Label htmlFor="text-message">Text</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="file" id="file-message" />
                  <Label htmlFor="file-message">File</Label>
                </div>
              </RadioGroup>
            </div>

            {messageInputType === "text" ? (
              <div className="space-y-2">
                <Label htmlFor="pgp-message">PGP Armored Message</Label>
                <Textarea
                  id="pgp-message"
                  placeholder="Enter PGP armored message here..."
                  className="h-44 text-xs"
                  value={pgpMessage}
                  onChange={(e) => setPgpMessage(e.target.value)}
                  rows={5}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="pgp-file">PGP File (.pgp or .asc)</Label>
                <Input
                  id="pgp-file"
                  type="file"
                  accept=".pgp,.asc"
                  onChange={handleMessageFileChange}
                />
              </div>
            )}
          </div>

          {/* PGP Key Section */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">PGP Key</h2>
            <div className="flex flex-col md:flex-row justify-around items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="space-y-3">
                <Label>Input Method</Label>
                <RadioGroup
                  defaultValue="text"
                  onValueChange={setKeyInputType}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="text-key" />
                    <Label htmlFor="text-key">Text</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="file" id="file-key" />
                    <Label htmlFor="file-key">File</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Conditional sections for key input and passphrase */}
            {operation === "decrypt" && (
              <div className="space-y-3">
                <Label htmlFor="private-key">Private Key</Label>
                {keyInputType == "text" ? (
                  <Textarea
                    id="private-key"
                    placeholder="Enter private key here..."
                    className="h-44 text-xs"
                    value={pgpKey}
                    onChange={(e) => setPgpKey(e.target.value)}
                    rows={5}
                  />
                ) : (
                  <Input
                    id="pgp-file"
                    type="file"
                    accept=".pgp,.asc"
                    onChange={handleKeyFileChange}
                  />
                )}
                <div className="space-y-2">
                  <Label htmlFor="passphrase">Passphrase</Label>
                  <Input
                    id="passphrase"
                    type="password"
                    placeholder="Enter passphrase"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                  />
                </div>
              </div>
            )}

            {operation === "decryptAndValidate" && (
              <div className="space-y-3">
                <Label htmlFor="public-key">Public Key</Label>
                {keyInputType == "text" ? (
                  <Textarea
                    id="public-key"
                    placeholder="Enter public key here..."
                    className="h-44 text-xs"
                    value={pgpKey}
                    onChange={(e) => setPgpKey(e.target.value)}
                    rows={5}
                  />
                ) : (
                  <Input
                    id="key-file"
                    type="file"
                    accept=".asc"
                    onChange={handleKeyFileChange}
                  />
                )}
                <Label htmlFor="private-key">Private Key</Label>
                {keyInputType == "text" ? (
                  <Textarea
                    id="private-key"
                    placeholder="Enter private key here..."
                    className="h-44 text-xs"
                    value={pgpKey}
                    onChange={(e) => setPgpKey(e.target.value)}
                    rows={5}
                  />
                ) : (
                  <Input
                    id="key-file"
                    type="file"
                    accept=".asc"
                    onChange={handleKeyFileChange}
                  />
                )}
                <div className="space-y-2">
                  <Label htmlFor="passphrase">Passphrase</Label>
                  <Input
                    id="passphrase"
                    type="password"
                    placeholder="Enter passphrase"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                  />
                </div>
                <Button>Test Private key Decryption</Button>
              </div>
            )}

            {operation === "validateSignature" && (
              <div className="space-y-3">
                <Label htmlFor="public-key">Public Key</Label>
                {keyInputType == "text" ? (
                  <Textarea
                    id="public-key"
                    placeholder="Enter public key here..."
                    className="h-44 text-xs"
                    value={pgpKey}
                    onChange={(e) => setPgpKey(e.target.value)}
                    rows={5}
                  />
                ) : (
                  <Input
                    id="key-file"
                    type="file"
                    accept=".asc"
                    onChange={handleKeyFileChange}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <Button onClick={handleAction} className="flex items-center gap-2">
          {operation === "decrypt" && <Unlock className="w-4 h-4" />}
          {operation === "decryptAndValidate" && <Lock className="w-4 h-4" />}
          {operation === "validateSignature" && (
            <CheckCircle className="w-4 h-4" />
          )}
          {operation === "decrypt"
            ? "Decrypt"
            : operation === "decryptAndValidate"
              ? "Decrypt and Validate Signature"
              : "Validate Signature"}
        </Button>

        {/* Result Message */}
        {result && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              result.success ? "bg-green-100" : "bg-red-100"
            } flex items-center space-x-4`}
          >
            {result.success ? (
              <CheckCircle className="text-green-500" />
            ) : (
              <AlertCircle className="text-red-500" />
            )}
            <span className="text-lg font-medium">{result.message}</span>
          </div>
        )}

        {/* Decrypted Data */}
        {decryptedData && (
          <div className="mt-6 space-y-2">
            <h2 className="text-lg font-semibold">Decrypted Data</h2>
            <Textarea
              readOnly
              value={decryptedData}
              rows={5}
              className="bg-gray-100 text-xs"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
