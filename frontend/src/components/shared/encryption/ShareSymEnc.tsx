import { DecryptButton } from "@/components/shared/decryption/DecryptButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePrivateKeyDecryption } from "@/hooks/keys/usePrivateKeyDecryption";
import { useToast } from "@/hooks/use-toast";
import usePgpAsymmetricEncryptionInputsStore from "@/lib/store/useAsymmetricEncryptionPrivPubKeysProvided";
import SelectPgpKeyPair from "@/routes/keys/components/key-gen/SelectPgpKeyPair";
import { keys } from "@wailsjs/go/models";
import { Eye, EyeOff, Share } from "lucide-react";
import React from "react";
import { hybridencryption } from "@wailsjs/go/models";
import { PerformHybridEnOnExistingData } from "@wailsjs/go/hybridencryption/HybridEncryption";

interface Props {
  data: keys.KeyInfo;
}

// FIXME:  we need to properly implement this functionality
// How should we properly perform the hybrind enc on existing
// Symmetric data

export default function ShareSymEnc({ data }: Props) {
  const { toast } = useToast();
  const {
    selectedPgpKeyPair,
    providedPubKey,
    providedPrivKey,
    setProvidedPrivKey,
    setProvidedPubKey,
    clearPair,
    clearPriv,
    clearPub,
  } = usePgpAsymmetricEncryptionInputsStore();

  const [isPrivateKeyVisible, setIsPrivateKeyVisible] = React.useState(false);

  // form data for folder name and passphrase
  const [folderName, setFolderName] = React.useState<string>("");
  const [passphrase, setPassphrase] = React.useState<string>("");

  const { decryptedPrivKey, handleDecryptPrivKey, handleHidePrivKey } =
    usePrivateKeyDecryption({
      keyName: selectedPgpKeyPair,
    });

  React.useEffect(() => {
    if (decryptedPrivKey && decryptedPrivKey.length > 0) {
      const cleanedPrivKey = decryptedPrivKey
        .replace(/-----BEGIN PGP PRIVATE KEY-----/g, "")
        .replace(/-----END PGP PRIVATE KEY-----/g, "")
        .replace(/\s+/g, "")
        .trim();
      setProvidedPrivKey(cleanedPrivKey);
    }
  }, [decryptedPrivKey, setProvidedPrivKey]);

  // Manual public key input handling
  const handlePublicKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedPubKey = e.target.value
      .replace(/-----BEGIN PGP PUBLIC KEY-----/g, "")
      .replace(/-----END PGP PUBLIC KEY-----/g, "")
      .replace(/\s+/g, "")
      .trim();
    setProvidedPubKey(cleanedPubKey);
  };

  // Manual private key input handling
  const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedPrivKey = e.target.value
      .replace(/-----BEGIN PGP PRIVATE KEY-----/g, "")
      .replace(/-----END PGP PRIVATE KEY-----/g, "")
      .replace(/\s+/g, "")
      .trim();
    setProvidedPrivKey(cleanedPrivKey);
  };

  const onClose = () => {
    clearPair();
    clearPriv();
    clearPub();
    handleHidePrivKey();
  };

  const handlePerformHybridEnc = async () => {
    const missingFields = [];

    if (!data) missingFields.push("Data");
    if (!passphrase) missingFields.push("Passphrase");
    if (!folderName) missingFields.push("Folder Name");
    if (!providedPubKey) missingFields.push("Public Key");
    if (!providedPrivKey) missingFields.push("Private Key");

    if (missingFields.length > 0) {
      missingFields.forEach((field) => {
        toast({
          variant: "destructive",
          className: "bg-red-500 border-0",
          title: `Missing Field: ${field}`,
          description: `Please provide a value for ${field}.`,
        });
      });
      return;
    }

    const reqData: hybridencryption.RequestData = {
      data: data.name,
      passphrase,
      folderName,
      pubKey: providedPubKey,
      privKey: providedPrivKey,
    };

    try {
      const response: hybridencryption.ResponseData =
        await PerformHybridEnOnExistingData(reqData);
      toast({
        variant: "default",
        title: "Encryption Successful",
        description: "Your data and passphrase have been encrypted.",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : JSON.stringify(error);

      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Encryption Failed",
        description:
          errorMessage || "An unknown error occurred during encryption.",
      });
    } finally {
      setFolderName("");
      setPassphrase("");
      setProvidedPrivKey("");
      setProvidedPubKey("");
      clearPub();
      clearPriv();
      clearPair();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <Share className="w-5 h-5 text-primary hover:text-primary-dark" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Symmetric Encrypted Data</DialogTitle>
          <DialogDescription>
            Provide the folder name and passphrase, select your PGP key pair or
            manually enter keys to share the encrypted data.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Folder Name Input */}
          <div className="space-y-2">
            <Label htmlFor="folderName" className="text-sm font-medium">
              Folder Name
            </Label>
            <Input
              id="folderName"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </div>

          {/* Passphrase Input */}
          <div className="space-y-2">
            <Label htmlFor="passphrase" className="text-sm font-medium">
              Passphrase
            </Label>
            <Input
              id="passphrase"
              type="password"
              placeholder="Enter passphrase"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
            />
          </div>

          {/* PGP Key Pair Selection */}
          <div className="space-y-2">
            <Label htmlFor="pgpKeyPair" className="block text-sm font-medium">
              PGP Key Pair
            </Label>
            <SelectPgpKeyPair />
          </div>

          {/* Public Key Field */}
          <div className="space-y-2 mt-4">
            <Label
              htmlFor="publicKey"
              className="block text-sm font-medium text-foreground dark:text-foreground-dark"
            >
              Public Key
            </Label>
            <Input
              id="publicKey"
              placeholder="Public Key"
              value={providedPubKey || ""}
              onChange={handlePublicKeyChange}
            />
          </div>

          {/* Private Key Field */}
          <div className="space-y-2 mt-4">
            <Label
              htmlFor="privateKey"
              className="block text-sm font-medium text-foreground dark:text-foreground-dark"
            >
              Private Key
            </Label>
            {decryptedPrivKey ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setIsPrivateKeyVisible(!isPrivateKeyVisible)}
                  className="ml-2"
                >
                  {isPrivateKeyVisible ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </Button>
                <em className="text-sm text-green-500 ml-2">
                  Private key is decrypted.
                </em>
              </>
            ) : providedPrivKey ? (
              <>
                <em className="text-sm text-red-500">
                  Please decrypt your private key.
                </em>
                <DecryptButton
                  onSubmit={handleDecryptPrivKey}
                  keyName={providedPrivKey}
                />
              </>
            ) : (
              <Input
                id="privateKey"
                placeholder="Private Key"
                type={isPrivateKeyVisible ? "text" : "password"}
                value={providedPrivKey || ""}
                onChange={handlePrivateKeyChange}
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handlePerformHybridEnc}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
