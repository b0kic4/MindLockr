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
import { LoadEncryptedKeyContent } from "@wailsjs/go/keys/KeyRetrieve";

interface Props {
  data: keys.KeyInfo;
}

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
      keyPath: selectedPgpKeyPair,
    });

  React.useEffect(() => {
    if (decryptedPrivKey && decryptedPrivKey.length > 0) {
      setProvidedPrivKey(decryptedPrivKey);
    }
  }, [decryptedPrivKey, setProvidedPrivKey]);

  // Manual public key input handling
  const handlePublicKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProvidedPubKey(e.target.value);
  };

  // Manual private key input handling
  const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProvidedPrivKey(e.target.value);
  };

  const resetState = () => {
    // Clear all form inputs and state variables
    setFolderName("");
    setPassphrase("");
    setProvidedPrivKey("");
    setProvidedPubKey("");
    clearPub();
    clearPriv();
    clearPair();
    handleHidePrivKey();
    setIsPrivateKeyVisible(false);
  };

  const onClose = () => {
    resetState();
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

    const loadedData = await LoadEncryptedKeyContent(data.name, data.algorithm);

    if (!loadedData) {
      return toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Transforming failed",
        description: "Encrypted data not found in the filesystem",
      });
    }

    const reqData: hybridencryption.RequestData = {
      data: loadedData,
      algorithmType: data.algorithm,
      passphrase,
      folderName,
      pubKey: providedPubKey,
      privKey: providedPrivKey,
    };

    try {
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
      resetState();
    }
  };

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogTrigger asChild>
        <button>
          <Share className="w-5 h-5 text-primary hover:text-primary-dark" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-w-full min-w-[350px] max-h-[75vh] sm:max-h-[500px] lg:max-h-[600px] xl:max-h-[650px] flex flex-col overflow-y-auto p-4 sm:p-6 md:p-8">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Share your encrypted data with others</DialogTitle>
        </DialogHeader>

        <div className="flex-1 grid gap-4 py-4 overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="folderName" className="text-sm font-medium">
              Folder Name
            </Label>
            <Input
              id="folderName"
              className="w-full"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passphrase" className="text-sm font-medium">
              Passphrase for decrypting the data
            </Label>
            <Input
              id="passphrase"
              type="password"
              className="w-full"
              placeholder="Enter passphrase"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pgpKeyPair" className="block text-sm font-medium">
              PGP Key Pair
            </Label>
            <SelectPgpKeyPair />
          </div>

          <div className="space-y-2 mt-4">
            <Label
              htmlFor="publicKey"
              className="block text-sm font-medium text-foreground dark:text-foreground-dark"
            >
              Public Key
            </Label>
            <Input
              id="publicKey"
              className="w-full"
              placeholder="Public Key"
              value={providedPubKey || ""}
              onChange={handlePublicKeyChange}
            />
          </div>

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
            ) : (
              providedPrivKey && (
                <>
                  <em className="text-sm text-red-500">
                    Please decrypt your private key.
                  </em>
                  <DecryptButton
                    onSubmit={handleDecryptPrivKey}
                    keyName={providedPrivKey}
                  />
                </>
              )
            )}
            <Input
              id="privateKey"
              className="w-full"
              placeholder="Private Key"
              type={isPrivateKeyVisible ? "text" : "password"}
              value={providedPrivKey || ""}
              onChange={handlePrivateKeyChange}
            />
          </div>
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button onClick={handlePerformHybridEnc}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
