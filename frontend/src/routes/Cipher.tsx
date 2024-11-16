import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Decrypt,
  DecryptAndValidate,
  ValidateSignature,
} from "@wailsjs/go/hybdec/HybDec";
import {
  AlertCircle,
  CheckCircle,
  Lock,
  Unlock,
  FileText,
  Key,
  CopyIcon,
} from "lucide-react";
import { hybdec } from "@wailsjs/go/models";
import { LogInfo } from "@wailsjs/runtime/runtime";
import { FiCheck, FiCopy } from "react-icons/fi";

export default function Cipher() {
  const [operation, setOperation] = React.useState<
    "decrypt" | "decryptAndValidate" | "validateSignature"
  >("decrypt");
  const [messageInputType, setMessageInputType] = React.useState("text");
  const [keyInputType, setKeyInputType] = React.useState("text");
  const [pgpMessage, setPgpMessage] = React.useState("");
  const [pgpKey, setPgpKey] = React.useState("");
  const [pubPgpKey, setPubPgpKey] = React.useState("");
  const [passphrase, setPassphrase] = React.useState("");
  const [result, setResult] = React.useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [decryptedData, setDecryptedData] = React.useState<{
    message?: string;
    signature?: boolean;
  } | null>(null);

  const handleAction = async () => {
    try {
      if (operation === "decrypt") {
        await decryptMessage();
      } else if (operation === "decryptAndValidate") {
        await decryptAndValidate();
      } else if (operation === "validateSignature") {
        await validateSignature();
      }
    } catch (error) {
      LogInfo("Operation not supported");
    }
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

  const handlePubKeyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        setPubPgpKey(content);
      };
      reader.readAsText(file);
    }
  };

  const handlePrivKeyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const decryptMessage = async () => {
    try {
      LogInfo("in decrypt message");
      const reqData: hybdec.RequestData = {
        data: pgpMessage,
        privKey: pgpKey,
        privPassphrase: passphrase,
      };
      const response: hybdec.ReturnType = await Decrypt(reqData);
      LogInfo(JSON.stringify(response));
      setDecryptedData({ message: response.data });
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
        pubKey: pubPgpKey,
        privKey: pgpKey,
        privPassphrase: passphrase,
      });
      LogInfo(JSON.stringify(response));
      setDecryptedData({
        message: response.data,
        signature: response.valid,
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Decryption and validation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  };

  const validateSignature = async () => {
    try {
      const isValid = await ValidateSignature({
        data: pgpMessage,
        pubKey: pubPgpKey,
        privKey: pgpKey,
        privPassphrase: passphrase,
      });
      LogInfo(JSON.stringify(isValid));
      setDecryptedData({ signature: isValid });
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

  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = () => {
    if (decryptedData?.message) {
      navigator.clipboard.writeText(decryptedData.message);
      setIsCopied(true);

      // Reset the animation after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-background dark:bg-background-dark shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          PGP Cipher Operations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs
          defaultValue="decrypt"
          onValueChange={(value) => setOperation(value as typeof operation)}
        >
          <TabsList className="grid w-full grid-cols-3 dark:bg-zinc-700">
            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
            <TabsTrigger value="decryptAndValidate">
              Decrypt & Validate
            </TabsTrigger>
            <TabsTrigger value="validateSignature">
              Validate Signature
            </TabsTrigger>
          </TabsList>
          <TabsContent value="decrypt">
            <p className="text-sm text-muted-foreground mt-2">
              Decrypt a PGP encrypted message using a private key.
            </p>
          </TabsContent>
          <TabsContent value="decryptAndValidate">
            <p className="text-sm text-muted-foreground mt-2">
              Decrypt a PGP message and validate its signature.
            </p>
          </TabsContent>
          <TabsContent value="validateSignature">
            <p className="text-sm text-muted-foreground mt-2">
              Validate the signature of a PGP signed message.
            </p>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              PGP Message
            </h2>
            <RadioGroup
              defaultValue="text"
              onValueChange={setMessageInputType}
              className="flex space-x-4"
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
            {messageInputType === "text" ? (
              <Textarea
                placeholder="Enter PGP armored message here..."
                className="h-44 text-sm"
                value={pgpMessage}
                onChange={(e) => setPgpMessage(e.target.value)}
              />
            ) : (
              <Input
                id="pgp-file"
                type="file"
                accept=".pgp,.asc"
                onChange={handleMessageFileChange}
              />
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Key className="w-5 h-5" />
              PGP Key
            </h2>
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
            {keyInputType === "text" ? (
              <Textarea
                placeholder={"Enter Public Key Here"}
                className="h-44 text-sm"
                value={pubPgpKey}
                onChange={(e) => setPubPgpKey(e.target.value)}
              />
            ) : (
              <Input
                type="file"
                accept=".asc"
                onChange={handlePubKeyFileChange}
              />
            )}

            {keyInputType === "text" ? (
              <Textarea
                placeholder={"Enter Private Key Here"}
                className="h-44 text-sm"
                value={pgpKey}
                onChange={(e) => setPgpKey(e.target.value)}
              />
            ) : (
              <Input
                type="file"
                accept=".asc"
                onChange={handlePrivKeyFileChange}
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
        </div>

        <Button
          onClick={handleAction}
          className="w-full flex items-center justify-center gap-2"
        >
          {operation === "decrypt" && <Unlock className="w-4 h-4" />}
          {operation === "decryptAndValidate" && <Lock className="w-4 h-4" />}
          {operation === "validateSignature" && (
            <CheckCircle className="w-4 h-4" />
          )}
          {operation === "decrypt"
            ? "Decrypt"
            : operation === "decryptAndValidate"
              ? "Decrypt and Validate"
              : "Validate Signature"}
        </Button>

        {result && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              result.success
                ? "bg-green-100 dark:bg-green-800"
                : "bg-red-100 dark:bg-red-800"
            } flex items-center space-x-4`}
          >
            {result.success ? (
              <CheckCircle className="text-green-500 dark:text-green-300" />
            ) : (
              <AlertCircle className="text-red-500 dark:text-red-300" />
            )}
            <span className="text-sm font-medium">{result.message}</span>
          </div>
        )}

        {decryptedData && (
          <div className="mt-4 space-y-4">
            {decryptedData.message && (
              <div>
                <h2 className="text-lg font-semibold">Decrypted Message</h2>
                <Textarea
                  readOnly
                  value={decryptedData.message}
                  rows={5}
                  className="bg-background dark:bg-background-dark text-sm text-foreground dark:text-foreground-dark"
                />
                <Button
                  onClick={handleCopy}
                  variant={"ghost"}
                  className="flex text-center items-center justify-center gap-2 absolute top-2 text-xs text-green-500 py-1  rounded transition"
                >
                  {isCopied ? <FiCheck /> : <FiCopy />}{" "}
                  {isCopied ? "Copied" : "Copy"}
                </Button>
              </div>
            )}
            {decryptedData.signature !== undefined && (
              <div
                className={`p-4 rounded-lg ${
                  decryptedData.signature
                    ? "bg-green-100 dark:bg-green-800"
                    : "bg-red-100 dark:bg-red-800"
                }`}
              >
                <span className="text-sm font-medium">
                  Signature{" "}
                  {decryptedData.signature ? "is valid" : "is invalid"}.
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
