import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { useKeys } from "@/hooks/keyring-management/useKeys";
import { TextSearchIcon } from "lucide-react";
import React from "react";
import { getKeyColumns } from "./components/keyring-management/KeyColumns";
import { KeyTypeFilter } from "./components/keyring-management/KeyTypeFilter";

// add just saving already encrypted keys

export default function KeyringManagement() {
  const { keys } = useKeys();
  const [filterKeyType, setFilterKeyType] = React.useState<string>("All");

  const handleEdit = (key: string) => {
    console.log("Edit key:", key);
  };

  const handleDelete = (key: string) => {
    console.log("Delete key:", key);
  };

  const columns = React.useMemo(
    () => getKeyColumns(handleEdit, handleDelete),
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
