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
import { usePrivateKeyDecryption } from "@/hooks/keys/usePrivateKeyDecryption";
import usePgpAsymmetricEncryptionInputsStore from "@/lib/store/useAsymmetricEncryptionPrivPubKeysProvided";
import {
  RetrievePgpPrivKey,
  RetrievePgpPubKey,
} from "@wailsjs/go/keys/KeyRetrieve";
import React from "react";

// FIXME:
// Fixing state formatting
// Reseting
// PEM Blocks

export default function SelectPgpKeyPair() {
  const {
    selectedPgpKeyPair,
    setSelectPgpKeyPair,
    setProvidedPrivKey,
    setProvidedPubKey,
    clearPriv,
    clearPair,
    clearPub,
  } = usePgpAsymmetricEncryptionInputsStore();

  const { handleHidePrivKey } = usePrivateKeyDecryption({
    keyPath: selectedPgpKeyPair,
  });

  const { pgpKeys, fetchPgpKeys } = usePgpKeys();

  const [isPublicChecked, setIsPublicChecked] = React.useState(false);
  const [isPrivateChecked, setIsPrivateChecked] = React.useState(false);
  const [encType, setEncType] = React.useState<string>("ECC");

  React.useEffect(() => {
    fetchPgpKeys();
  }, []);

  const handlePrivateKeyReset = () => {
    setProvidedPrivKey("");
    handleHidePrivKey();
  };

  const handleKeyPairChange = (value: string) => {
    if (value !== selectedPgpKeyPair) {
      setProvidedPrivKey("");
      setProvidedPubKey("");
      handlePrivateKeyReset();

      setIsPublicChecked(false);
      setIsPrivateChecked(false);
      handleHidePrivKey();
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
            setProvidedPubKey(pubKey);
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
        handleHidePrivKey();
        handlePrivateKeyReset();
      }
    }
  };

  const handleEncryptionTypeChange = (type: string) => {
    setEncType(type);

    setProvidedPrivKey("");
    clearPub();
    clearPriv();
    clearPair();

    setIsPublicChecked(false);
    setIsPrivateChecked(false);

    handleHidePrivKey();
  };

  const filteredPgpKeys = pgpKeys.filter((key) => key.type === encType);

  return (
    <div className="p-6 max-w-md bg-background dark:bg-background-dark text-white rounded-lg shadow-md">
      <em className="text-sm text-foreground dark:text-foreground-dark block mb-2">
        From here you are selecting your PGP keys
      </em>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-foreground dark:text-foreground-dark">
          PGP Key Pair
        </label>
        <Select value={encType} onValueChange={handleEncryptionTypeChange}>
          <SelectTrigger className="w-full bg-gray-700 text-white border border-gray-600 rounded">
            <SelectValue placeholder="Filter by Key Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ECC">ECC</SelectItem>
              <SelectItem value="RSA">RSA</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Select value={selectedPgpKeyPair} onValueChange={handleKeyPairChange}>
          <SelectTrigger className="w-full bg-gray-700 text-white border border-gray-600 rounded">
            <SelectValue placeholder="Select a PGP Key Pair" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>PGP Keys</SelectLabel>
              {filteredPgpKeys.map((key) => (
                <SelectItem key={key.name} value={key.folderPath}>
                  {key.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {selectedPgpKeyPair && (
        <div className="mt-2 text-foreground dark:text-foreground-dark">
          <label className="block text-sm font-medium mb-2">
            Select Keys to Retrieve:
          </label>
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <Checkbox
                id="publicKeyCheckbox"
                checked={isPublicChecked}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("public", checked as boolean)
                }
                className="text-white"
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
                className="text-white"
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
