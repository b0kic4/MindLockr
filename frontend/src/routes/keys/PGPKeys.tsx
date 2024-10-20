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
import { Accordion } from "@radix-ui/react-accordion";
import { TextSearchIcon } from "lucide-react";
import { useDebounce } from "use-debounce";
import React from "react";
import PgpKeyAccordionItem from "./components/PGP/PgpKeyAccordionItem";
import { PgpKeysGenForm } from "./components/PGP/PgpKeysGenForm";

export default function PGPKeys() {
  const { pgpKeys, fetchPgpKeys } = usePgpKeys();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [selectedType, setSelectedType] = React.useState<string>("all");

  const filteredKeys = pgpKeys
    .filter((keyName) =>
      keyName.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    )
    .filter((key) =>
      selectedType === "all" ? true : key.type === selectedType,
    );

  return (
    <div className="p-6 rounded shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground dark:text-foreground-dark">
          Your PGP Keys
        </h2>
        <PgpKeysGenForm fetchPgpKeys={fetchPgpKeys} />
      </div>

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

      <div className="relative flex items-center text-foreground dark:text-foreground-dark max-w-xs mt-4">
        <Input
          type="text"
          placeholder="Search PGP Keys"
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute left-3 text-gray-400">
          <TextSearchIcon />
        </div>
      </div>

      {pgpKeys.length > 0 ? (
        filteredKeys.length > 0 ? (
          <Accordion type="multiple" className="mt-4">
            {filteredKeys.map((keyName) => (
              <PgpKeyAccordionItem keyName={keyName} />
            ))}
          </Accordion>
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
