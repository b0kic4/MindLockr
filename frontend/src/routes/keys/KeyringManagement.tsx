import { Input } from "@/components/ui/input";
import { useHybDeleteEn, useSymDeleteEn } from "@/hooks/keys/useDeleteKey";
import { useKeys } from "@/hooks/keys/useKeys";
import { TextSearchIcon } from "lucide-react";
import React from "react";
import KeysGenModal from "./components/key-gen/KeyGenModal";
import { KeyTypeFilter } from "./components/keyring-management/KeyTypeFilter";
import { HybridDataTable } from "./components/keyring-management/tables/hybrid-table";
import { getHybridKeyColumns } from "./components/keyring-management/tables/hybridKeyColumns";
import { SymmetricDataTable } from "./components/keyring-management/tables/symmetric-table";
import { getSymmetricKeyColumns } from "./components/keyring-management/tables/symmetricKeyColumns";

export default function KeyringManagement() {
  const { keys, fetchKeys } = useKeys();
  const [filterKeyType, setFilterKeyType] = React.useState<string>("Symmetric");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const { handleSymDelete } = useSymDeleteEn({ fetchKeys });
  const { handleHybDelete } = useHybDeleteEn({ fetchKeys });

  const symcolumns = React.useMemo(
    () => getSymmetricKeyColumns(handleSymDelete),
    [handleSymDelete],
  );

  const hybcolumns = React.useMemo(
    () => getHybridKeyColumns(handleHybDelete),
    [handleHybDelete],
  );

  const symmetricFilteredKeys = keys.symmetric.filter((key) =>
    key.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const hybridFilteredKeys = keys.asymmetric.filter((key) =>
    key.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // in the hybrid encryption table
  // we should have the
  // verify button
  // decrypt button
  //
  // we should have a in Select => ALL, SYMMETRIC and HYBRID (ASYMMETRIC)

  const renderContent = () => {
    if (filterKeyType === "Symmetric") {
      return (
        <SymmetricDataTable data={symmetricFilteredKeys} columns={symcolumns} />
      );
    } else if (filterKeyType === "Asymmetric") {
      return (
        <HybridDataTable
          data={hybridFilteredKeys}
          columns={hybcolumns as any}
        />
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
      <div className="mb-4 flex items-center gap-3">
        <div className="flex items-center flex-grow max-w-md relative">
          <div className="absolute left-3 text-gray-400">
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
    </div>
  );
}
