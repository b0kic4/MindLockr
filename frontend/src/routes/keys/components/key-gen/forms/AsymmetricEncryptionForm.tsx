import { DecryptButton } from "@/components/shared/decryption/DecryptButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePrivateKeyDecryption } from "@/hooks/keys/usePrivateKeyDecryption";
import usePgpAsymmetricEncryptionInputsStore from "@/lib/store/useAsymmetricEncryptionPrivPubKeysProvided";
import usePgpKeysStore from "@/lib/store/usePgpKeysStore";
import {
  RetrievePgpPubKey,
  RetrievePgpPrivKey,
} from "@wailsjs/go/keys/KeyRetrieve";
import { LogInfo } from "@wailsjs/runtime/runtime";
import { EyeOff, Eye } from "lucide-react";
import React from "react";
import SelectPgpKeyPair from "../SelectPgpKeyPair";

export default function AsymmetricKeyEncryptionForm() {
  const { selectedPgpKeyPair } = usePgpKeysStore();
  const { setProvidedPrivKey, setProvidedPubKey } =
    usePgpAsymmetricEncryptionInputsStore();

  const [publicKeyInput, setPublicKeyInput] = React.useState("");
  const [encryptedPrivateKey, setEncryptedPrivateKey] = React.useState("");
  const [providedPrivateKey, setProvidedPrivateKey] = React.useState("");
  const [isPrivateKeyVisible, setIsPrivateKeyVisible] = React.useState(false);

  // Hook to handle private key decryption
  const { decryptedPrivKey, handleDecryptPrivKey } = usePrivateKeyDecryption({
    keyName: selectedPgpKeyPair,
  });

  React.useEffect(() => {
    if (selectedPgpKeyPair) {
      const fetchKeys = async () => {
        try {
          const pubKey = await RetrievePgpPubKey(selectedPgpKeyPair);
          const privKey = await RetrievePgpPrivKey(selectedPgpKeyPair);

          const cleanedPubKey = pubKey
            .replace(/-----BEGIN PGP PUBLIC KEY-----/g, "")
            .replace(/-----END PGP PUBLIC KEY-----/g, "")
            .replace(/\s+/g, "")
            .trim();

          setPublicKeyInput(cleanedPubKey);

          setProvidedPubKey(cleanedPubKey);

          setEncryptedPrivateKey(privKey);
        } catch (error) {
          console.error("Error fetching keys for", selectedPgpKeyPair, error);
        }
      };

      fetchKeys();
    }
  }, [selectedPgpKeyPair, setProvidedPubKey]);

  React.useEffect(() => {
    if (decryptedPrivKey && decryptedPrivKey.length > 0) {
      const cleanedPrivKey = decryptedPrivKey
        .replace(/-----BEGIN PGP PRIVATE KEY-----/g, "")
        .replace(/-----END PGP PRIVATE KEY-----/g, "")
        .replace(/\s+/g, "")
        .trim();

      setProvidedPrivateKey(cleanedPrivKey);

      // Also set it into providedPrivKey for further use
      setProvidedPrivKey(cleanedPrivKey);
    }
  }, [decryptedPrivKey, setProvidedPrivKey]);

  // custom inputs for entering the public and private keys
  // public the reciever and the private is the the senders
  // key that will be used for creating the signature
  //
  // than for sharing with are taking the folder and sharing
  // that data across other users

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
              value={publicKeyInput}
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
              {providedPrivateKey ? (
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
              ) : (
                <DecryptButton
                  onSubmit={handleDecryptPrivKey}
                  keyName={encryptedPrivateKey}
                />
              )}
            </div>
            <Input
              id="privateKey"
              placeholder="Private Key"
              type={isPrivateKeyVisible ? "text" : "password"}
              value={providedPrivateKey || "Private key is encrypted"}
              readOnly
            />
          </div>
        </>
      )}
    </div>
  );
}
