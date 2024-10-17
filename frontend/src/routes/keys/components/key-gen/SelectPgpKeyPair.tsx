import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePgpKeys } from "@/hooks/keys/usePgpKeys";
import usePgpKeysStore from "@/lib/store/usePgpKeysStore";

export default function SelectPgpKeyPair() {
  const selectedPgpKeyPair = usePgpKeysStore(
    (state) => state.selectedPgpKeyPair,
  );
  const setSelectPgpKeyPair = usePgpKeysStore(
    (state) => state.setSelectPgpKeyPair,
  );
  const { pgpKeys, fetchPgpKeys } = usePgpKeys();

  React.useEffect(() => {
    fetchPgpKeys();
  }, [fetchPgpKeys]);

  const handleChange = (value: string) => {
    setSelectPgpKeyPair(value);
  };

  return (
    <Select value={selectedPgpKeyPair} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a PGP Key Pair" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>PGP Keys</SelectLabel>
          {pgpKeys.map((keyName) => (
            <SelectItem key={keyName.name} value={keyName.name}>
              {keyName.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
