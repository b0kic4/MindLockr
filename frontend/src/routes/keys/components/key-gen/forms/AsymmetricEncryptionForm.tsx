import { DecryptButton } from "@/components/shared/decryption/DecryptButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePrivateKeyDecryption } from "@/hooks/keys/usePrivateKeyDecryption";
import usePgpAsymmetricEncryptionInputsStore from "@/lib/store/useAsymmetricEncryptionPrivPubKeysProvided";
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

  // get the passphrase of the function from hook
  // pass this function to the decrypt buton
  const getPassphrasePrivKey = async (passphrase: string) => {
    const providedPassphrase = await handleDecryptReturnPassphrase(passphrase);
    if (providedPassphrase.length > 0) setPrivKeyPassphrase(providedPassphrase);
  };

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
      setProvidedPrivKey(decryptedPrivKey);
    }
  }, [decryptedPrivKey]);

  // for manual input
  const handlePublicKeyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawPubKey = e.target.value;
    setProvidedPubKey(rawPubKey);
  };

  // for manual input
  const handlePrivateKeyChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const rawPrivKey = e.target.value;
    setProvidedPrivKey(rawPrivKey);
  };

  return (
    <div className="space-y-4 p-4 mt-4 rounded-lg">
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
        <Textarea
          id="publicKey"
          placeholder="Public Key"
          className="mb-2 bg-card dark:bg-muted-dark text-foreground dark:text-foreground-dark"
          value={providedPubKey || ""}
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

        <Textarea
          id="privateKey"
          placeholder="Private Key"
          value={providedPrivKey}
          className="mb-2 bg-card dark:bg-muted-dark text-foreground dark:text-foreground-dark"
          onChange={handlePrivateKeyChange}
        />
        <em className="text-sm text-purple-500 ml-2">
          Fill out the required information first. Once private key is
          decrypted, you have 5 seconds to submit the form.
        </em>
      </div>
    </div>
  );
}
