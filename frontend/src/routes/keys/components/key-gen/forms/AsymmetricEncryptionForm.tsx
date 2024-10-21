import { DecryptButton } from "@/components/shared/decryption/DecryptButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePrivateKeyDecryption } from "@/hooks/keys/usePrivateKeyDecryption";
import usePgpAsymmetricEncryptionInputsStore from "@/lib/store/useAsymmetricEncryptionPrivPubKeysProvided";
import { Eye, EyeOff } from "lucide-react";
import React from "react";
import SelectPgpKeyPair from "../SelectPgpKeyPair";

export default function AsymmetricKeyEncryptionForm() {
  // hooks
  const {
    selectedPgpKeyPair,
    providedPubKey,
    providedPrivKey,
    setProvidedPrivKey,
    setProvidedPubKey,
  } = usePgpAsymmetricEncryptionInputsStore();

  const { decryptedPrivKey, handleDecryptPrivKey, handleHidePrivKey } =
    usePrivateKeyDecryption({
      keyPath: selectedPgpKeyPair,
    });

  const [isPrivateKeyVisible, setIsPrivateKeyVisible] = React.useState(false);

  React.useEffect(() => {
    if (!providedPrivKey && decryptedPrivKey) {
      handleHidePrivKey();
    }

    // this is ensuring that there are no blocks
    // from select component
    if (decryptedPrivKey && decryptedPrivKey.length > 0) {
      const cleanedPrivKey = decryptedPrivKey
        .replace(/-----BEGIN PGP PRIVATE KEY-----/g, "")
        .replace(/-----END PGP PRIVATE KEY-----/g, "")
        .replace(/\s+/g, "")
        .trim();
      setProvidedPrivKey(cleanedPrivKey);
    }
  }, [decryptedPrivKey, setProvidedPrivKey]);

  // this is for manual inputs
  const handlePublicKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedPubKey = e.target.value
      .replace(/-----BEGIN PGP PUBLIC KEY-----/g, "")
      .replace(/-----END PGP PUBLIC KEY-----/g, "")
      .replace(/\s+/g, "")
      .trim();
    setProvidedPubKey(cleanedPubKey);
  };

  // this is for manual inputs
  const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedPrivKey = e.target.value
      .replace(/-----BEGIN PGP PRIVATE KEY-----/g, "")
      .replace(/-----END PGP PRIVATE KEY-----/g, "")
      .replace(/\s+/g, "")
      .trim();
    setProvidedPrivKey(cleanedPrivKey);
  };

  return (
    <div className="space-y-4 p-4 bg-muted dark:bg-muted-dark mt-4 rounded-lg">
      <h3 className="text-lg font-semibold">Asymmetric Key Encryption</h3>
      <p className="text-sm text-foreground dark:text-foreground-dark">
        Please select a PGP key pair or provide custom keys for asymmetric
        encryption.
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-between space-x-2">
          <label
            htmlFor="pgpKeyPair"
            className="block text-sm font-medium text-foreground dark:text-foreground-dark"
          >
            PGP Key Pair
          </label>
          <SelectPgpKeyPair />
        </div>
      </div>

      {selectedPgpKeyPair ? (
        <>
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between space-x-2">
              <label
                htmlFor="publicKey"
                className="block text-sm font-medium text-foreground dark:text-foreground-dark"
              >
                Public Key
              </label>
            </div>
            <Input
              id="publicKey"
              placeholder="Public Key"
              value={providedPubKey || ""}
              onChange={handlePublicKeyChange}
            />
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between space-x-2">
              <label
                htmlFor="privateKey"
                className="block text-sm font-medium text-foreground dark:text-foreground-dark"
              >
                Private Key
              </label>
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
                !decryptedPrivKey &&
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
            </div>

            <Input
              id="privateKey"
              placeholder="Private Key"
              type={isPrivateKeyVisible ? "text" : "password"}
              value={providedPrivKey || ""}
              onChange={handlePrivateKeyChange}
            />
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between space-x-2">
              <label
                htmlFor="publicKeyInput"
                className="block text-sm font-medium text-foreground dark:text-foreground-dark"
              >
                Enter Custom Public Key
              </label>
            </div>
            <Input
              id="publicKeyInput"
              placeholder="Enter custom public key"
              value={providedPubKey || ""}
              onChange={handlePublicKeyChange}
            />
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between space-x-2">
              <label
                htmlFor="privateKeyInput"
                className="block text-sm font-medium text-foreground dark:text-foreground-dark"
              >
                Enter Custom Private Key
              </label>
            </div>
            <Input
              id="privateKeyInput"
              placeholder="Enter custom private key"
              type={isPrivateKeyVisible ? "text" : "password"}
              value={providedPrivKey || ""}
              onChange={handlePrivateKeyChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
