import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSelectNumOfBits from "@/lib/store/useSelectNumberOfBits";

export default function NumberOfBitsRSA() {
  const { setSelectedBits } = useSelectNumOfBits();

  const handleSelectNumOfBits = (num: string) => {
    const bitSize = parseInt(num, 10);
    setSelectedBits(bitSize);
  };

  return (
    <Select onValueChange={handleSelectNumOfBits}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Number of Bits for RSA" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Bits</SelectLabel>
          <SelectItem value="1024">1024</SelectItem>
          <SelectItem value="2048">2048</SelectItem>
          <SelectItem value="3072">3072</SelectItem>
          <SelectItem value="4096">4096</SelectItem>
          <SelectItem value="7680">7680</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
