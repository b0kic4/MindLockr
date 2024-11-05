import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePgpKeys } from "@/hooks/keys/usePgpKeys";
import { TextSearchIcon } from "lucide-react";
import { useDebounce } from "use-debounce";
import React from "react";
import { PgpKeysGenForm } from "./components/PGP/PgpKeysGenForm";
import ListKeys from "./components/keyring-management/keys-list";

export default function PGPKeys() {
  const { pgpKeys, fetchPgpKeys } = usePgpKeys();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [selectedType, setSelectedType] = React.useState<string>("all");

  React.useEffect(() => {
    fetchPgpKeys();
  }, []);

  const filteredKeys = pgpKeys
    .filter((keyName) =>
      keyName.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    )
    .filter((key) =>
      selectedType === "all" ? true : key.type === selectedType,
    );

  // I should have a component that will be displayed under the list of the keys
  // with showing more informaiton about the key pair from entity or smth like that
  // just like on the gpa

  return (
    <div className="p-6 rounded shadow-md">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center flex-grow max-w-md relative">
          <div className="absolute  left-3 text-gray-400">
            <TextSearchIcon />
          </div>
          <Input
            type="text"
            placeholder="Search PGP Keys"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-shrink-0">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Key Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="ECC">ECC</SelectItem>
                <SelectItem value="RSA">RSA</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto">
          <PgpKeysGenForm fetchPgpKeys={fetchPgpKeys} />
        </div>
      </div>

      {pgpKeys.length > 0 ? (
        filteredKeys.length > 0 ? (
          <ListKeys keys={filteredKeys} />
        ) : (
          <p className="text-gray-600 text-center mt-8">
            No PGP keys match your search.
          </p>
        )
      ) : (
        <p className="text-foreground dark:text-foreground-dark text-center mt-8">
          You have no PGP keys. Click the "Generate PGP Keys" button to create
          one.
        </p>
      )}
    </div>
  );
}
