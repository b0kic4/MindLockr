import { DecryptButton } from "@/components/shared/decryption/DecryptButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePrivateKeyDecryption } from "@/hooks/keys/usePrivateKeyDecryption";
import usePgpAsymmetricEncryptionInputsStore from "@/lib/store/useAsymmetricEncryptionPrivPubKeysProvided";
import { cleanShownKey } from "@/lib/utils/useCleanKey";
import { LogError, LogInfo } from "@wailsjs/runtime/runtime";
import { Eye, EyeOff } from "lucide-react";
import React from "react";
import SelectPgpKeyPair from "../SelectPgpKeyPair";

// i need to rewrite the decryption of the private key
// so the passphrase of the decrypted private key
// to be sent to the server

interface Props {
  setPrivKeyPassphrase: (value: string) => void;
}

export default function AsymmetricKeyEncryptionForm({
  setPrivKeyPassphrase,
}: Props) {
  // hooks
  const {
    selectedPgpKeyPair,
    providedPubKey,
    encPrivKey,
    providedPrivKey,
    setProvidedPrivKey,
    setProvidedPubKey,
  } = usePgpAsymmetricEncryptionInputsStore();

  const {
    decryptedPrivKey,
    isDec,
    handleHidePrivKey,
    handleDecryptReturnPassphrase,
  } = usePrivateKeyDecryption({
    keyPath: selectedPgpKeyPair,
  });

  const [isPrivateKeyVisible, setIsPrivateKeyVisible] = React.useState(false);

  const [shownPubKey, setShownPubKey] = React.useState<string>("");
  const [shownPrivKey, setShownPrivKey] = React.useState<string>("");

  // get the passphrase of the function from hook
  // pass this function to the decrypt buton
  const getPassphrasePrivKey = async (passphrase: string) => {
    const providedPassphrase = await handleDecryptReturnPassphrase(passphrase);

    if (providedPassphrase.length > 0) setPrivKeyPassphrase(providedPassphrase);

    LogInfo(providedPassphrase);
  };

  // When keys are selected with SelectPgpKeyPair component
  React.useEffect(() => {
    const cleanedPrivKey = cleanShownKey(providedPrivKey);
    setShownPrivKey(cleanedPrivKey);

    const cleanedPubKey = cleanShownKey(providedPubKey);
    setShownPubKey(cleanedPubKey);
  }, [providedPubKey, providedPrivKey]);

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

      const formattedDecPrivKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----\n${cleanedPrivKey}\n-----END PGP PRIVATE KEY BLOCK-----`;
      setProvidedPrivKey(formattedDecPrivKey);
    }
  }, [decryptedPrivKey]);

  // for manual input
  const handlePublicKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawPubKey = e.target.value;

    const cleanedPubKey = cleanShownKey(rawPubKey);
    setShownPubKey(cleanedPubKey);

    const formattedPubKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----\n${cleanedPubKey}\n-----END PGP PUBLIC KEY BLOCK-----`;
    setProvidedPubKey(formattedPubKey);
  };

  // for manual input
  const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawPrivKey = e.target.value;

    const cleanedPrivKey = cleanShownKey(rawPrivKey);

    setShownPrivKey(cleanedPrivKey);

    const formattedPrivKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----\n${cleanedPrivKey}\n-----END PGP PRIVATE KEY BLOCK-----`;
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
                  onSubmit={getPassphrasePrivKey}
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
