import { DataTable } from "@/components/ui/data-table";
import { useKeys } from "@/hooks/keyring-management/useKeys";
import React from "react";
import { getKeyColumns } from "./components/keyring-management/KeyColumns";
import { KeyTypeFilter } from "./components/keyring-management/KeyTypeFilter";

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
          <div className="mb-4 flex">
            <KeyTypeFilter
              filterKeyType={filterKeyType}
              setFilterKeyType={setFilterKeyType}
            />
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
