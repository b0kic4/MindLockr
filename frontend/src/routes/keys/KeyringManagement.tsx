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

  const symmetricFilteredKeys = keys.symmetric.filter((key) =>
    key.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderContent = () => {
    if (filterKeyType === "Symmetric") {
      return <DataTable data={symmetricFilteredKeys} columns={columns} />;
    } else if (filterKeyType === "Asymmetric") {
      return <FileTreeAccordion />;
    } else {
      return (
        <p className="text-muted">
          No keys found. Please add or retrieve keys.
        </p>
      );
    }
  };

  return (
    <div className="p-6 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
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
      {renderContent()}
      {selectedKey && isDecrypted && (
        <DecryptedDataComponent
          keyInfo={selectedKey}
          onClose={handleDialogClose}
        />
      )}
    </div>
  );
}
