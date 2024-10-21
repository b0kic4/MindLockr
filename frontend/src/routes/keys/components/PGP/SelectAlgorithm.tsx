import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSelectAlgPgpGen from "@/lib/store/useSelectAlgPgpGen";

export default function SelectAlg() {
  const { setSelectedAlg } = useSelectAlgPgpGen();

  const handleSelectAlg = (alg: string) => {
    setSelectedAlg(alg);
  };

  return (
    <Select onValueChange={handleSelectAlg}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an Algorithm" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Algorithms</SelectLabel>
          <SelectItem value="ECC">ECC</SelectItem>
          <SelectItem value="RSA">RSA</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
