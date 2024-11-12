import { Button } from "@/components/ui/button";
import { FiCheck, FiCopy } from "react-icons/fi";
import React from "react";
import { PGPInfo } from "@/lib/types/keys";
import {
  RetrievePgpPubKey,
  RetrievePgpPrivKey,
} from "@wailsjs/go/pgpfs/PgpRetrieve";
import { useToast } from "@/hooks/use-toast";
import { LogInfo, LogError } from "@wailsjs/runtime/runtime";
import { usePrivateKeyDecryption } from "@/hooks/keys/usePrivateKeyDecryption";
import { Input } from "@/components/ui/input";
import { XIcon } from "lucide-react";

export default function KeyMoreInfo({ keyInfo }: { keyInfo: PGPInfo }) {
  const [copied, setCopied] = React.useState(false);
  const [passphrase, setPassphrase] = React.useState<string>("");
  const [isDecryptionFormVisible, setIsDecryptionFormVisible] =
    React.useState(false);

  const { handleDecryptPrivKey, decryptedPrivKey, isDec } =
    usePrivateKeyDecryption({
      keyPath: keyInfo.Path,
    });
  const { toast } = useToast();

  const handleCopy = (text: string, successMessage: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      variant: "default",
      className: "bg-green-500 border-0",
      title: successMessage,
      description: `${successMessage} is now in your clipboard.`,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await handleDecryptPrivKey(passphrase);
    if (success) {
      setIsDecryptionFormVisible(false);
    }
  };

  const handleAction = async (action: string, keyPath: string) => {
    try {
      let keyData = "";
      let successMessage = "";

      switch (action) {
        case "copyPublic":
          keyData = await RetrievePgpPubKey(keyPath);
          successMessage = "Public key";
          break;
        case "copyPrivate":
          keyData = await RetrievePgpPrivKey(keyPath);
          successMessage = "Private key";
          break;
        case "copyFingerprint":
          keyData = keyInfo.Fingerprint || "";
          successMessage = "Fingerprint";
          break;
        case "export":
          LogInfo("Exporting key pair...");
          return;
        default:
          return;
      }

      if (keyData) {
        handleCopy(keyData, successMessage);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : JSON.stringify(err);
      LogError(`Failed to process ${action}: ${errorMessage}`);
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: `Failed to process ${action}`,
        description: errorMessage,
      });
    }
  };

  return (
    <div className="mt-5">
      <h4 className="font-bold mb-2">More Information</h4>
      <ul>
        {Object.entries(keyInfo).map(([key, value]) => (
          <li
            key={key}
            className="flex justify-start gap-2 items-center relative"
          >
            <span className="font-semibold">{key}:</span>
            <span>{value}</span>
            {key === "Fingerprint" && (
              <Button
                onClick={() => handleAction("copyFingerprint", keyInfo.Path)}
                variant="ghost"
                className="flex items-center gap-2 ml-2 text-xs text-green-500 py-1 rounded transition"
              >
                {copied ? <FiCheck /> : <FiCopy />} {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </li>
        ))}
      </ul>
      <div className="flex flex-row gap-2">
        <Button
          size="sm"
          onClick={() => handleAction("copyPublic", keyInfo.Path)}
          className="flex mt-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 shadow-lg transition-all"
        >
          Get Public Key
        </Button>
        <Button
          size="sm"
          onClick={() => handleAction("copyPrivate", keyInfo.Path)}
          className="flex mt-4 bg-yellow-600 text-white font-semibold rounded hover:bg-yellow-700 shadow-lg transition-all"
        >
          Get Encrypted Private Key
        </Button>

        {isDec && (
          <Button
            size="sm"
            onClick={() => handleCopy(decryptedPrivKey || "", "Private key")}
            className="flex mt-4 bg-green-600 text-white font-semibold rounded hover:bg-green-700 shadow-lg transition-all"
          >
            Copy Decrypted Private Key
          </Button>
        )}

        {isDecryptionFormVisible && !isDec && (
          <form onSubmit={handleSubmit} className="mt-4">
            <Input
              type="password"
              placeholder="Enter passphrase"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              required
              className="w-full mb-2 border-2"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-green-600 text-white font-semibold rounded hover:bg-green-700 shadow-lg transition-all"
            >
              Decrypt
            </Button>
          </form>
        )}

        {!isDec && !isDecryptionFormVisible && (
          <Button
            size="sm"
            onClick={() => setIsDecryptionFormVisible(true)}
            className="flex mt-4 bg-pink-600 text-white font-semibold rounded hover:bg-pink-700 shadow-lg transition-all"
          >
            Get Decrypted Private Key
          </Button>
        )}

        {isDecryptionFormVisible && (
          <Button
            size="icon"
            onClick={() => setIsDecryptionFormVisible(false)}
            className="flex mt-4 bg-red-600 text-white font-semibold rounded hover:bg-red-700 shadow-lg transition-all"
          >
            <XIcon className="h-5 w-5" />
          </Button>
        )}
      </div>
      <Button
        size="sm"
        onClick={() => handleAction("export", keyInfo.Path)}
        className="flex mt-4 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 shadow-lg transition-all"
      >
        Export Key Pair
      </Button>
    </div>
  );
}
