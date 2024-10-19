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
  } = usePgpAsymmetricEncryptionInputsStore();

  const { decryptedPrivKey, handleDecryptPrivKey, handleHidePrivKey } =
    usePrivateKeyDecryption({
      keyName: selectedPgpKeyPair,
    });

  const [isPrivateKeyVisible, setIsPrivateKeyVisible] = React.useState(false);

  React.useEffect(() => {
    if (!providedPrivKey && decryptedPrivKey) {
      handleHidePrivKey();
    }

    if (providedPrivKey && decryptedPrivKey && decryptedPrivKey.length > 0) {
      const cleanedPrivKey = decryptedPrivKey
        .replace(/-----BEGIN PGP PRIVATE KEY-----/g, "")
        .replace(/-----END PGP PRIVATE KEY-----/g, "")
        .replace(/\s+/g, "")
        .trim();

      setProvidedPrivKey(cleanedPrivKey);
    }
  }, [decryptedPrivKey, setProvidedPrivKey, providedPrivKey]);

  return (
    <div className="space-y-4 p-4 bg-muted dark:bg-muted-dark mt-4 rounded-lg">
      <h3 className="text-lg font-semibold">Asymmetric Key Encryption</h3>
      <p className="text-sm text-foreground dark:text-foreground-dark">
        Please select a PGP key pair for asymmetric encryption.
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

      {selectedPgpKeyPair && (
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
              value={providedPubKey}
              readOnly
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
                    Private key is provided and decrypted.
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

            {providedPrivKey ? (
              <Input
                id="privateKey"
                placeholder="Private Key"
                type={isPrivateKeyVisible ? "text" : "password"}
                value={providedPrivKey}
                readOnly
              />
            ) : !providedPrivKey ? (
              <Input
                id="privateKeyInput"
                placeholder="Enter custom private key"
                type="text"
                value={providedPrivKey}
                onChange={(e) => setProvidedPrivKey(e.target.value)}
              />
            ) : (
              <Input
                id="privateKey"
                placeholder="Private Key"
                type="text"
                value={providedPrivKey}
                readOnly
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
