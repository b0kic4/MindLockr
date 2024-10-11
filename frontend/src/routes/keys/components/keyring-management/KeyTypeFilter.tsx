import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface KeyTypeFilterProps {
  filterKeyType: string;
  setFilterKeyType: (value: string) => void;
}

export const KeyTypeFilter: React.FC<KeyTypeFilterProps> = ({
  filterKeyType,
  setFilterKeyType,
}) => (
  <Select value={filterKeyType} onValueChange={setFilterKeyType}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Filter By Type" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Symmetric">Symmetric</SelectItem>
      <SelectItem value="Asymmetric">Asymmetric</SelectItem>
    </SelectContent>
  </Select>
);
