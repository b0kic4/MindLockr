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
import React from "react";

export default function SelectPgpKeyPair() {
  const {
    selectedPgpKeyPair,
    encType,
    setEncType,
    setSelectPgpKeyPair,
    setProvidedPrivKey,
    setProvidedPubKey,
    clearPub,
  } = usePgpAsymmetricEncryptionInputsStore();

  const { pgpKeys, fetchPgpKeys } = usePgpKeys();

  const [isPublicChecked, setIsPublicChecked] = React.useState(false);
  const [isPrivateChecked, setIsPrivateChecked] = React.useState(false);

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

  // Filtering the PGP keys based on the selected key type
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
        <Select value={encType} onValueChange={setEncType}>
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

      {/* PGP Key Pair Selection */}
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
      <div className="mt-4 p-2 bg-yellow-100 text-yellow-700 rounded-md">
        <p className="text-sm">
          <strong>Important:</strong> Even if you are not using your PGP keys,
          you must select the correct encryption type (ECC or RSA) based on the
          custom keys you are providing. This will ensure the program can create
          valid encryption using your selected key type.
        </p>
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
