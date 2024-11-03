import { DecryptButton } from "@/components/shared/decryption/DecryptButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { cleanShownKey } from "@/lib/utils/useCleanKey";
import SelectPgpKeyPair from "@/routes/keys/components/key-gen/SelectPgpKeyPair";
import { HybEn } from "@wailsjs/go/hybridencryption/HybridEncryption";
import { LoadEncryptedKeyContent } from "@wailsjs/go/keys/KeyRetrieve";
import { hybridencryption, keys } from "@wailsjs/go/models";
import { Eye, EyeOff, Share } from "lucide-react";
import React from "react";

interface Props {
  data: keys.KeyInfo;
}

export default function ShareSymEnc({ data }: Props) {
  const { toast } = useToast();
  const {
    selectedPgpKeyPair,
    providedPubKey,
    providedPrivKey,
    encPrivKey,
    setProvidedPrivKey,
    setProvidedPubKey,
    clearEnKey,
    clearPair,
    clearPriv,
    clearPub,
  } = usePgpAsymmetricEncryptionInputsStore();

  const { decryptedPrivKey, handleDecryptPrivKey, handleHidePrivKey } =
    usePrivateKeyDecryption({
      keyPath: selectedPgpKeyPair,
    });

  const [isPrivateKeyVisible, setIsPrivateKeyVisible] = React.useState(false);

  // form data for folder name and passphrase
  const [folderName, setFolderName] = React.useState<string>("");
  const [passphrase, setPassphrase] = React.useState<string>("");

  const [shownPubKey, setShownPubKey] = React.useState<string>("");
  const [shownPrivKey, setShownPrivKey] = React.useState<string>("");

  React.useEffect(() => {
    if (!providedPrivKey && decryptedPrivKey) {
      handleHidePrivKey();
    }

    // after 3.5 sec update providedPrivKey
    // to encrypted value
    if (providedPrivKey != decryptedPrivKey) {
      setProvidedPrivKey(encPrivKey);
    }

    if (decryptedPrivKey && decryptedPrivKey.length > 0) {
      const cleanedPrivKey = cleanShownKey(decryptedPrivKey);
      setShownPrivKey(cleanedPrivKey);

      const formattedDecPrivKey = `-----BEGIN PGP PRIVATE KEY-----\n${cleanedPrivKey}\n-----END PGP PRIVATE KEY-----`;
      setProvidedPrivKey(formattedDecPrivKey);
    }
  }, [decryptedPrivKey]);

  // for manual input
  const handlePublicKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawPubKey = e.target.value;

    const cleanedPubKey = cleanShownKey(rawPubKey);
    setShownPubKey(cleanedPubKey);

    const formattedPubKey = `-----BEGIN PGP PUBLIC KEY-----\n${cleanedPubKey}\n-----END PGP PUBLIC KEY-----`;
    setProvidedPubKey(formattedPubKey);
  };

  // for manual input
  const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawPrivKey = e.target.value;

    const cleanedPrivKey = cleanShownKey(rawPrivKey);

    setShownPrivKey(cleanedPrivKey);

    const formattedPrivKey = `-----BEGIN PGP PRIVATE KEY-----\n${cleanedPrivKey}\n-----END PGP PRIVATE KEY-----`;
    setProvidedPrivKey(formattedPrivKey);
  };

  const resetState = () => {
    // Clear all form inputs and state variables
    setFolderName("");
    setPassphrase("");
    clearPub();
    clearEnKey();
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

    const loadedData = await LoadEncryptedKeyContent(data.name);

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
      passphrase,
      privPassphrase: "",
      folderName,
      pubKey: providedPubKey,
      privKey: providedPrivKey,
    };

    try {
      await HybEn(reqData);
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
              placeholder="Public Key"
              value={shownPubKey || ""}
              onChange={handlePublicKeyChange}
            />
          </div>

          <div className="space-y-2 mt-4 gap-4">
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
                <div className="space-x-2">
                  <em className="text-sm text-red-500">
                    Please decrypt your private key.
                  </em>
                  <DecryptButton
                    onSubmit={handleDecryptPrivKey}
                    keyName={providedPrivKey}
                  />
                </div>
              )
            )}
            <Input
              id="privateKey"
              placeholder="Private Key"
              type={isPrivateKeyVisible ? "text" : "password"}
              value={shownPrivKey || ""}
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
