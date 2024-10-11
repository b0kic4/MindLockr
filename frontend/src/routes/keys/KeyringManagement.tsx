import React from "react";
import DecryptedDataComponent from "@/components/shared/decryption/ShowDecryptedData";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { useKeys } from "@/hooks/keys/useKeys";
import { useDeleteKey } from "@/hooks/keys/useDeleteKey";
import { KeyInfo } from "@/lib/types/keys";
import { TextSearchIcon } from "lucide-react";
import { getKeyColumns } from "./components/keyring-management/KeyColumns";
import { KeyTypeFilter } from "./components/keyring-management/KeyTypeFilter";
import { FileTreeAccordion } from "./components/keyring-management/AsymmetricFileTreeAccordion";

export default function KeyringManagement() {
  const { keys, fetchKeys } = useKeys();
  const [filterKeyType, setFilterKeyType] = React.useState<string>("Symmetric");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedKey, setSelectedKey] = React.useState<KeyInfo | null>(null);
  const [isDecrypted, setIsDecrypted] = React.useState(false);

  const { handleDelete } = useDeleteKey({ fetchKeys });

  const handleDecrypt = (key: KeyInfo) => {
    // this is passed to KeyColumns
    // key button is just used to change the state
    // of displaying decrypted data component
    setSelectedKey(key);
    setIsDecrypted(true);
  };

  const handleDialogClose = () => {
    setIsDecrypted(false);
    setSelectedKey(null);
  };

  const columns = React.useMemo(
    () => getKeyColumns(handleDelete, handleDecrypt),
    [handleDelete, handleDecrypt],
  );

  const symmetricFilteredKeys = keys
    .filter((key) => key.type === "Symmetric")
    .filter((key) => {
      if (searchQuery === "") return true;
      return key.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 text-gray-400">
                <TextSearchIcon />
              </div>
            </div>
          </div>
          {filterKeyType === "Symmetric" && (
            <DataTable data={symmetricFilteredKeys} columns={columns} />
          )}
          {/* {filterKeyType === "Asymmetric" && <FileTreeAccordion />} */}
          {selectedKey && isDecrypted && (
            // ovo se prikazuje kada se klikne key icon
            // za decryption
            <DecryptedDataComponent
              keyInfo={selectedKey}
              onClose={handleDialogClose}
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
