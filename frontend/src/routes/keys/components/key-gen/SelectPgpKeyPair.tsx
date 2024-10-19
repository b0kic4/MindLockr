import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePgpKeys } from "@/hooks/keys/usePgpKeys";
import usePgpAsymmetricEncryptionInputsStore from "@/lib/store/useAsymmetricEncryptionPrivPubKeysProvided";
import {
  RetrievePgpPrivKey,
  RetrievePgpPubKey,
} from "@wailsjs/go/keys/KeyRetrieve";
import React, { useState } from "react";

export default function SelectPgpKeyPair() {
  const {
    selectedPgpKeyPair,
    setSelectPgpKeyPair,
    setProvidedPrivKey,
    setProvidedPubKey,
    clearPub,
  } = usePgpAsymmetricEncryptionInputsStore();

  const { pgpKeys, fetchPgpKeys } = usePgpKeys();

  const [isPublicChecked, setIsPublicChecked] = useState(false);
  const [isPrivateChecked, setIsPrivateChecked] = useState(false);

  React.useEffect(() => {
    fetchPgpKeys();
  }, []);

  const handlePrivateKeyReset = () => {
    setProvidedPrivKey("");
  };

  const handleKeyPairChange = (value: string) => {
    if (value !== selectedPgpKeyPair) {
      setProvidedPrivKey("");
      setProvidedPubKey("");
      handlePrivateKeyReset();

      setIsPublicChecked(false);
      setIsPrivateChecked(false);
    }
    setSelectPgpKeyPair(value);
  };

  const handleCheckboxChange = async (
    keyType: "public" | "private",
    checked: boolean,
  ) => {
    if (checked) {
      if (selectedPgpKeyPair) {
        try {
          if (keyType === "public") {
            const pubKey = await RetrievePgpPubKey(selectedPgpKeyPair);
            const cleanedPubKey = pubKey
              .replace(/-----BEGIN PGP PUBLIC KEY-----/g, "")
              .replace(/-----END PGP PUBLIC KEY-----/g, "")
              .replace(/\s+/g, "")
              .trim();
            setProvidedPubKey(cleanedPubKey);
            setIsPublicChecked(true);
          } else if (keyType === "private") {
            const privKey = await RetrievePgpPrivKey(selectedPgpKeyPair);
            setProvidedPrivKey(privKey);
            setIsPrivateChecked(true);
          }
        } catch (error) {
          console.error(
            `Error fetching ${keyType} key for`,
            selectedPgpKeyPair,
            error,
          );
        }
      }
    } else {
      if (keyType === "public") {
        setProvidedPubKey("");
        setIsPublicChecked(false);
        clearPub();
      } else if (keyType === "private") {
        setProvidedPrivKey("");
        setIsPrivateChecked(false);
        handlePrivateKeyReset();
      }
    }
  };

  return (
    <div>
      <Select value={selectedPgpKeyPair} onValueChange={handleKeyPairChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a PGP Key Pair" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>PGP Keys</SelectLabel>
            {pgpKeys.map((key) => (
              <SelectItem key={key.name} value={key.name}>
                {key.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {selectedPgpKeyPair && (
        <div className="mt-2">
          <label className="block text-sm font-medium text-foreground dark:text-foreground-dark">
            Select Keys to Retrieve:
          </label>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center">
              <Checkbox
                id="publicKeyCheckbox"
                checked={isPublicChecked}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("public", checked as boolean)
                }
              />
              <label htmlFor="publicKeyCheckbox" className="ml-2">
                Public Key
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="privateKeyCheckbox"
                checked={isPrivateChecked}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("private", checked as boolean)
                }
              />
              <label htmlFor="privateKeyCheckbox" className="ml-2">
                Private Key
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
