import { DecryptButton } from "@/components/shared/decryption/DecryptButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePrivateKeyDecryption } from "@/hooks/keys/usePrivateKeyDecryption";
import usePgpAsymmetricEncryptionInputsStore from "@/lib/store/useAsymmetricEncryptionPrivPubKeysProvided";
import { LogInfo } from "@wailsjs/runtime/runtime";
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

  const { decryptedPrivKey, isDec, handleDecryptPrivKey, handleHidePrivKey } =
    usePrivateKeyDecryption({
      keyPath: selectedPgpKeyPair,
    });

  const [isPrivateKeyVisible, setIsPrivateKeyVisible] = React.useState(false);

  // FIXME:
  // Because of the timeout in handleDecryptPrivKey
  // we have the priv key is decrypted when we should
  // not have it

  // States to show cleaned keys (without PEM blocks) to the user
  const [shownPubKey, setShownPubKey] = React.useState<string>("");
  const [shownPrivKey, setShownPrivKey] = React.useState<string>("");

  // When keys are selected with SelectPgpKeyPair component
  React.useEffect(() => {
    // every time private key changes we should
    // set isPrivateKeyVisible to false
    const cleanedPrivKey = providedPrivKey
      .replace(/-----BEGIN [A-Z\s]+ KEY-----/g, "")
      .replace(/-----END [A-Z\s]+ KEY-----/g, "")
      .replace(/\s+/g, "")
      .trim();
    setShownPrivKey(cleanedPrivKey);

    const cleanedPubKey = providedPubKey
      .replace(/-----BEGIN [A-Z\s]+ KEY-----/g, "")
      .replace(/-----END [A-Z\s]+ KEY-----/g, "")
      .replace(/\s+/g, "")
      .trim();
    setShownPubKey(cleanedPubKey);
  }, [providedPubKey, providedPrivKey]);

  React.useEffect(() => {
    if (!providedPrivKey && decryptedPrivKey) {
      handleHidePrivKey();
    }

    if (decryptedPrivKey && decryptedPrivKey.length > 0) {
      const cleanedPrivKey = decryptedPrivKey
        .replace(/-----BEGIN [A-Z\s]+ KEY-----/g, "")
        .replace(/-----END [A-Z\s]+ KEY-----/g, "")
        .replace(/\s+/g, "")
        .trim();
      setShownPrivKey(cleanedPrivKey);

      const formattedDecPrivKey = `-----BEGIN PGP PRIVATE KEY-----\n${cleanedPrivKey}\n-----END PGP PRIVATE KEY-----`;
      setProvidedPrivKey(formattedDecPrivKey);
    }
  }, [decryptedPrivKey, setProvidedPrivKey]);

  // Handle public key changes for manual input
  const handlePublicKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawPubKey = e.target.value;

    // Clean the input for display
    const cleanedPubKey = rawPubKey
      .replace(/-----BEGIN [A-Z\s]+ KEY-----/g, "")
      .replace(/-----END [A-Z\s]+ KEY-----/g, "")
      .replace(/\s+/g, "")
      .trim();

    setShownPubKey(cleanedPubKey);

    // Format with PGP PEM blocks for submission
    const formattedPubKey = `-----BEGIN PGP PUBLIC KEY-----\n${cleanedPubKey}\n-----END PGP PUBLIC KEY-----`;
    setProvidedPubKey(formattedPubKey);
  };

  // Handle private key changes for manual input
  const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawPrivKey = e.target.value;

    // Clean the input for display
    const cleanedPrivKey = rawPrivKey
      .replace(/-----BEGIN [A-Z\s]+ KEY-----/g, "")
      .replace(/-----END [A-Z\s]+ KEY-----/g, "")
      .replace(/\s+/g, "")
      .trim();

    setShownPrivKey(cleanedPrivKey);

    // Format with PGP PEM blocks for submission
    const formattedPrivKey = `-----BEGIN PGP PRIVATE KEY-----\n${cleanedPrivKey}\n-----END PGP PRIVATE KEY-----`;
    setProvidedPrivKey(formattedPrivKey);
  };

  return (
    <div className="space-y-4 p-4 bg-muted dark:bg-muted-dark mt-4 rounded-lg">
      <h3 className="text-lg font-semibold">Asymmetric Key Encryption</h3>
      <p className="text-sm text-foreground dark:text-foreground-dark">
        Please select a PGP key pair or provide custom keys for asymmetric
        encryption.
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-center">
          <SelectPgpKeyPair />
        </div>
      </div>

      {/* Public Key Input */}
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
          value={shownPubKey || ""}
          onChange={handlePublicKeyChange}
        />
      </div>

      {/* Private Key Input */}
      <div className="space-y-2 mt-4">
        <div className="flex items-center justify-between space-x-2">
          <label
            htmlFor="privateKey"
            className="block text-sm font-medium text-foreground dark:text-foreground-dark"
          >
            Private Key
          </label>
          {isDec ? (
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
            !isDec &&
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
          value={shownPrivKey || ""}
          onChange={handlePrivateKeyChange}
        />
      </div>
    </div>
  );
}
