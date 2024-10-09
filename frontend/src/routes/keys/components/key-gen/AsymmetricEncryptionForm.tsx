import { CustomDecryptButton } from "@/components/shared/decryption/CustomButtonDecryptDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePrivateKeyDecryption } from "@/hooks/keys/usePrivateKeyDecryption";
import usePubPrivAsymmetricEncryptionInputsStore from "@/lib/store/useAsymmetricEncryptionPrivPubKeysProvided";
import usePubPrivStore from "@/lib/store/usePubPrivStore";
import React from "react";

export default function AsymmetricKeyEncryptionForm() {
  const { privKey, pubKey } = usePubPrivStore();

  // FIXME:
  // Here might be a bug when getting the users private key
  // and then trying to provide some other private key
  // need to test that

  // local input
  const [publicKeyInput, setPublicKeyInput] = React.useState("");

  // zustand store
  const { setProvidedPrivKey, setProvidedPubKey } =
    usePubPrivAsymmetricEncryptionInputsStore();

  // data when the useMyPrivate key button is clicked
  const [encryptedPrivateKeyInput, setEncryptedPrivateKeyInput] =
    React.useState("");

  // actual private key that will be used for encryption
  const [providedPrivateKey, setProvidedPrivateKey] =
    React.useState<string>("");

  // decryption of the users key
  const { decryptedPrivKey, handleDecryptPrivKey } = usePrivateKeyDecryption();

  // assigning decrypted key to the provided private key input
  React.useEffect(() => {
    if (decryptedPrivKey.length != 0) {
      setProvidedPrivateKey(decryptedPrivKey);
    }

    if (providedPrivateKey.length != 0) {
      const cleanedPrivKey = providedPrivateKey
        .replace(/-----BEGIN EC PRIVATE KEY-----/g, "")
        .replace(/-----END EC PRIVATE KEY-----/g, "")
        .replace(/\n/g, "")
        .trim();

      setProvidedPrivateKey(cleanedPrivKey);
      // store value
      setProvidedPrivKey(cleanedPrivKey);
    }
  }, [decryptedPrivKey, providedPrivateKey]);

  // when clicked on the use my public key
  const handleUseMyPublicKey = () => {
    const cleanedPublicKey = pubKey
      .replace(/-----BEGIN PUBLIC KEY-----/g, "")
      .replace(/-----END PUBLIC KEY-----/g, "")
      .replace(/\n/g, "")
      .trim();
    setPublicKeyInput(cleanedPublicKey);
    // store value
    setProvidedPubKey(cleanedPublicKey);
  };

  const handleGetEncryptedPrivateKey = async () => {
    setEncryptedPrivateKeyInput(privKey);
  };

  return (
    <div className="space-y-4 p-4 bg-muted dark:bg-muted-dark mt-4 rounded-lg">
      <h3 className="text-lg font-semibold">Asymmetric Key Encryption</h3>
      <p className="text-sm text-foreground dark:text-foreground-dark">
        Please provide the recipient's public key and your private key for
        asymmetric encryption.
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-between space-x-2">
          <label
            htmlFor="publicKey"
            className="block text-sm font-medium text-foreground dark:text-foreground-dark"
          >
            Public Key
          </label>
          <Button
            variant="ghost"
            onClick={handleUseMyPublicKey}
            className="text-sm p-1 text-blue-500 underline"
          >
            Use my Public Key
          </Button>
        </div>
        <Input
          id="publicKey"
          placeholder="Enter Public Key"
          value={publicKeyInput}
          onChange={(e) => setPublicKeyInput(e.target.value)}
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
          <div>
            {!encryptedPrivateKeyInput && (
              <Button
                variant="ghost"
                onClick={handleGetEncryptedPrivateKey}
                className="text-sm p-1 text-blue-500 underline"
              >
                Use my Private Key
              </Button>
            )}
            {encryptedPrivateKeyInput && (
              <CustomDecryptButton
                onSubmit={handleDecryptPrivKey}
                keyName={decryptedPrivKey ? decryptedPrivKey : privKey}
              />
            )}
          </div>
        </div>
        {encryptedPrivateKeyInput && (
          <>
            <Input
              id="privateKey"
              placeholder="Enter Private Key"
              value={encryptedPrivateKeyInput}
              onChange={(e) => setEncryptedPrivateKeyInput(e.target.value)}
            />
            <Input
              readOnly
              placeholder="Decrypted Key"
              type="password"
              value={providedPrivateKey}
            />
          </>
        )}
        {!encryptedPrivateKeyInput && (
          <Input
            id="privateKey"
            placeholder="Enter Private Key"
            value={providedPrivateKey}
            onChange={(e) => setProvidedPrivateKey(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
