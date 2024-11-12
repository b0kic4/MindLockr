import { Input } from "@/components/ui/input";
import { useKeys } from "@/hooks/keys/useKeys";
import { TextSearchIcon } from "lucide-react";
import React from "react";
import KeysGenModal from "./components/key-gen/KeyGenModal";
import { KeyTypeFilter } from "./components/keyring-management/KeyTypeFilter";
import { HybridCardList } from "./components/keyring-management/cards/pgp-card-list";
import { SymmetricCardList } from "./components/keyring-management/cards/symmetric-card-list";

export default function KeyringManagement() {
  const { keys, fetchKeys } = useKeys();
  const [filterKeyType, setFilterKeyType] =
    React.useState<string>("Asymmetric");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const symmetricFilteredKeys = keys.symmetric.filter((key) =>
    key.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const hybridFilteredKeys = keys.asymmetric.filter((key) =>
    key.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderContent = () => {
    if (filterKeyType === "Symmetric") {
      return <SymmetricCardList data={symmetricFilteredKeys} />;
    } else if (filterKeyType === "Asymmetric") {
      return <HybridCardList data={hybridFilteredKeys} />;
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
