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
  const [pgpMessage, setPgpMessage] = React.useState("");
  const [pgpKey, setPgpKey] = React.useState("");
  const [messageFile, setMessageFile] = React.useState<File | null>(null);
  const [keyFile, setKeyFile] = React.useState<File | null>(null);
  const [messageInputType, setMessageInputType] = React.useState("manual");
  const [keyInputType, setKeyInputType] = React.useState("manual");
  const [keyType, setKeyType] = React.useState("public");
  const [passphrase, setPassphrase] = React.useState("");
  const [result, setResult] = React.useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [decryptedData, setDecryptedData] = React.useState<string | null>(null);
  const { setSelectedKey, setSelectedMsg } = useCipherPgpData();

  const handleMessageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMessageFile(e.target.files[0]);
    }
  };

  const handleKeyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setKeyFile(e.target.files[0]);
    }
  };

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
    <Card className="w-full max-w-7xl mx-auto bg-background dark:bg-background-dark shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          PGP Cipher
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PGP Message Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">PGP Message</h2>
            <div className="space-y-2">
              <Label>Input Method</Label>
              <RadioGroup
                defaultValue="manual"
                onValueChange={setMessageInputType}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="manual-message" />
                  <Label htmlFor="manual-message">Text</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="file" id="file-message" />
                  <Label htmlFor="file-message">File</Label>
                </div>
              </RadioGroup>
            </div>

            {messageInputType === "manual" ? (
              <div className="space-y-2">
                <Label htmlFor="pgp-message">PGP Armored Message</Label>
                <Textarea
                  id="pgp-message"
                  placeholder="Enter PGP armored message here..."
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
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">PGP Key</h2>
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="space-y-3">
                <Label>Key Type</Label>
                <RadioGroup
                  defaultValue="public"
                  onValueChange={setKeyType}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public-key" />
                    <Label htmlFor="public-key">Public Key</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private-key" />
                    <Label htmlFor="private-key">Private Key</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Input Method</Label>
                <RadioGroup
                  defaultValue="manual"
                  onValueChange={setKeyInputType}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="manual-key" />
                    <Label htmlFor="manual-key">Text</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="file" id="file-key" />
                    <Label htmlFor="file-key">File</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Conditional sections for key input and passphrase */}
            {keyInputType === "manual" ? (
              <div className="space-y-2">
                <Label htmlFor="pgp-key">
                  {keyType === "public" ? "Public" : "Private"} Key
                </Label>
                <Textarea
                  id="pgp-key"
                  placeholder={`Enter ${keyType} key here...`}
                  value={pgpKey}
                  onChange={(e) => setPgpKey(e.target.value)}
                  rows={5}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="key-file">Key File (.asc)</Label>
                <Input
                  id="key-file"
                  type="file"
                  accept=".asc"
                  onChange={handleKeyFileChange}
                />
              </div>
            )}

            {keyType === "private" && (
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
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Button onClick={decryptMessage} className="flex items-center gap-2">
            <Unlock className="w-4 h-4" />
            Decrypt Message
          </Button>
          <Button
            onClick={decryptAndValidate}
            className="flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Decrypt and Validate
          </Button>
          <Button
            onClick={validateSignature}
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Validate Signature
          </Button>
        </div>

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
              className="bg-gray-100"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
