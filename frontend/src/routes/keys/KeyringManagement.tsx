import DecryptedDataComponent from "@/components/shared/decryption/ShowDecryptedData";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { useDeleteKey } from "@/hooks/keys/useDeleteKey";
import { useKeys } from "@/hooks/keys/useKeys";
import useSelectedAsymmetricFileStore from "@/lib/store/useSelectAsymmetricFile";
import { KeyInfo } from "@/lib/types/keys";
import { TextSearchIcon } from "lucide-react";
import React from "react";
import KeysGenModal from "./components/key-gen/KeyGenModal";
import AsymmetricDecryption from "./components/keyring-management/AsymmetricDecryption";
import { FileTreeAccordion } from "./components/keyring-management/AsymmetricFileTreeAccordion";
import { getKeyColumns } from "./components/keyring-management/KeyColumns";
import { KeyTypeFilter } from "./components/keyring-management/KeyTypeFilter";

export default function KeyringManagement() {
  const { keys, fetchKeys } = useKeys();
  const [filterKeyType, setFilterKeyType] = React.useState<string>("Symmetric");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedKey, setSelectedKey] = React.useState<KeyInfo | null>(null);
  const [isDecrypted, setIsDecrypted] = React.useState(false);

  const { handleDelete } = useDeleteKey({ fetchKeys });
  const { selectedFile } = useSelectedAsymmetricFileStore();

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
      return (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <FileTreeAccordion />
          </div>
          <div className="col-span-8">
            {selectedFile ? (
              <AsymmetricDecryption />
            ) : (
              <p className="text-center text-muted">Select a key to decrypt</p>
            )}
          </div>
        </div>
      );
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
      <div className="mb-4 flex items-center">
        <div className="flex items-center flex-grow max-w-md relative">
          <div className="absolute  left-3 text-gray-400">
            <TextSearchIcon />
          </div>
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="ml-4 flex items-center">
          <KeyTypeFilter
            filterKeyType={filterKeyType}
            setFilterKeyType={setFilterKeyType}
          />
        </div>

        <div className="ml-auto">
          <KeysGenModal fetchKeys={fetchKeys} />
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
