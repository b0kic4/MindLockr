import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSelectCurve from "@/lib/store/useSelectCurve";

export default function SelectCurve() {
  const { setSelectedCurve } = useSelectCurve();

  const handleSelectNumOfBits = (curve: string) => {
    setSelectedCurve(curve);
  };

  return (
    <Select onValueChange={handleSelectNumOfBits}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Type of Curve for ECC" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Curves</SelectLabel>
          <SelectItem value="curve25519">curve25519</SelectItem>
          <SelectItem value="curve25519-refresh">curve25519 refresh</SelectItem>
          <SelectItem value="curve448">curve448</SelectItem>
          <SelectItem value="curve448-refresh">curve448 refresh</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
