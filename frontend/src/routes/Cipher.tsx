import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, CheckCircle, Lock, Unlock } from "lucide-react";

export default function Cipher() {
  const [pgpMessage, setPgpMessage] = React.useState("");
  const [pgpKey, setPgpKey] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [inputType, setInputType] = React.useState("manual");
  const [keyType, setKeyType] = React.useState("public");
  const [passphrase, setPassphrase] = React.useState("");
  const [result, setResult] = React.useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const decryptMessage = () => {
    // Placeholder for PGP decryption logic
    setResult({ success: true, message: "Message decrypted successfully!" });
  };

  const decryptAndValidate = () => {
    // Placeholder for decryption and validation logic
    setResult({
      success: true,
      message: "Message decrypted and validated successfully!",
    });
  };

  const validateSignature = () => {
    // Placeholder for signature validation logic
    setResult({ success: true, message: "Signature validated successfully!" });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-background dark:bg-background-dark">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Enhanced PGP Cipher UI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs
          defaultValue="message"
          className="w-full bg-background dark:bg-background-dark"
        >
          <TabsList className="grid w-full grid-cols-2 bg-background dark:bg-background-dark">
            <TabsTrigger value="message">PGP Message</TabsTrigger>
            <TabsTrigger value="key">PGP Key</TabsTrigger>
          </TabsList>
          <TabsContent value="message" className="space-y-4">
            <div className="space-y-2">
              <Label>Input Method</Label>
              <RadioGroup
                defaultValue="manual"
                onValueChange={setInputType}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="manual-message" />
                  <Label htmlFor="manual-message">Manual Input</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="file" id="file-message" />
                  <Label htmlFor="file-message">File Upload</Label>
                </div>
              </RadioGroup>
            </div>
            {inputType === "manual" ? (
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
                  onChange={handleFileChange}
                />
              </div>
            )}
          </TabsContent>
          <TabsContent value="key" className="space-y-4">
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label>Input Method</Label>
              <RadioGroup
                defaultValue="manual"
                onValueChange={setInputType}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="manual-key" />
                  <Label htmlFor="manual-key">Manual Input</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="file" id="file-key" />
                  <Label htmlFor="file-key">File Upload</Label>
                </div>
              </RadioGroup>
            </div>
            {inputType === "manual" ? (
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
                  onChange={handleFileChange}
                />
              </div>
            )}
            {keyType === "private" && (
              <div className="space-y-2">
                <Label htmlFor="passphrase">Passphrase</Label>
                <Input
                  id="passphrase"
                  type="password"
                  placeholder="Enter passphrase for private key"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex flex-wrap gap-4">
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

        {result && (
          <div
            className={`p-4 rounded-md ${
              result.success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <p>{result.message}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
