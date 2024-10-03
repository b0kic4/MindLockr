import { PassphraseDialog } from "@/components/shared/decryption/DecrytDialog";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { useKeys } from "@/hooks/keyring-management/useKeys";
import { KeyInfo } from "@/lib/types/keys";
import { TextSearchIcon } from "lucide-react";
import React from "react";
import {
  AES128Decryption,
  AES192Decryption,
  AES256Decryption,
} from "../../../wailsjs/go/symmetricdecryption/Cryptography";
import { LoadEncryptedKeyContent } from "../../../wailsjs/go/keys/KeyRetrieve";
import { getKeyColumns } from "./components/keyring-management/KeyColumns";
import { KeyTypeFilter } from "./components/keyring-management/KeyTypeFilter";

// add just saving already encrypted keys

export default function KeyringManagement() {
  const { keys } = useKeys();
  const [filterKeyType, setFilterKeyType] = React.useState<string>("All");
  const [selectedKey, setSelectedKey] = React.useState<KeyInfo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleEdit = (key: KeyInfo) => {
    console.log("Edit key:", key);
  };

  const handleDelete = (key: KeyInfo) => {
    console.log("Delete key:", key);
  };

  const handleDecrypt = React.useCallback((key: KeyInfo) => {
    setSelectedKey(key);
    setIsDialogOpen(true);
  }, []);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedKey(null);
  };

  const handlePassphraseSubmit = async (passphrase: string) => {
    if (selectedKey) {
      try {
        const dataToDecrypt = {
          EncryptedData: await LoadEncryptedKeyContent(
            selectedKey.name,
            selectedKey.algorithm,
          ),
          Passphrase: passphrase,
        };

        let decryptedData = "";

        switch (selectedKey.algorithm) {
          case "AES-128":
            decryptedData = await AES128Decryption({
              encryptedData: dataToDecrypt.EncryptedData,
              passphrase: dataToDecrypt.Passphrase,
            });

            break;
          case "AES-192":
            decryptedData = await AES192Decryption({
              encryptedData: dataToDecrypt.EncryptedData,
              passphrase: dataToDecrypt.Passphrase,
            });

            break;
          case "AES-256":
            decryptedData = await AES256Decryption({
              encryptedData: dataToDecrypt.EncryptedData,
              passphrase: dataToDecrypt.Passphrase,
            });

            break;
          default:
            throw new Error("Unsupported algorithm");
        }
      } catch (error) {
        console.error("Decryption failed:", error);
      }
    }
  };

  const columns = React.useMemo(
    () => getKeyColumns(handleEdit, handleDelete, handleDecrypt),
    [handleEdit, handleDelete],
  );

  const filteredKeys =
    filterKeyType === "Symmetric" || filterKeyType === "Asymmetric"
      ? keys.filter((key) => key.type === filterKeyType)
      : keys;

  return (
    <div className="p-6 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
      <h2 className="text-2xl font-bold mb-4">Keyring Management</h2>
      {keys.length > 0 ? (
        <div className="mb-4">
          <div className="mb-4 flex items-center gap-3 max-w-lg">
            <KeyTypeFilter
              filterKeyType={filterKeyType}
              setFilterKeyType={setFilterKeyType}
            />
            <div className="relative flex items-center text-foreground dark:text-foreground-dark">
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <div className="absolute left-3 text-gray-400">
                <TextSearchIcon />
              </div>
            </div>
          </div>
          <DataTable data={filteredKeys} columns={columns} />
          {selectedKey && (
            <PassphraseDialog
              isOpen={isDialogOpen}
              onClose={handleDialogClose}
              onSubmit={handlePassphraseSubmit}
              keyName={selectedKey.name}
            />
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-muted">
            No keys found. Please add or retrieve keys.
          </p>
        </div>
      )}
    </div>
  );
}
