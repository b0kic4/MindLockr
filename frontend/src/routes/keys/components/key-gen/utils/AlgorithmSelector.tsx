import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  algorithm: string;
  setAlgorithm: (value: string) => void;
  algorithmType: string;
  setAlgorithmType: (value: string) => void;
};

export default function AlgorithmSelector({
  algorithm,
  setAlgorithm,
  algorithmType,
  setAlgorithmType,
}: Props) {
  return (
    <>
      <Select value={algorithm} onValueChange={setAlgorithm}>
        <SelectTrigger className="bg-card dark:bg-muted-dark text-foreground dark:text-foreground-dark">
          <SelectValue placeholder="Select encryption algorithm" />
        </SelectTrigger>
        <SelectContent className="bg-card dark:bg-card-dark text-foreground dark:text-foreground-dark">
          <SelectItem value="AES">AES</SelectItem>
        </SelectContent>
      </Select>

      {algorithm === "AES" && (
        <>
          <Select value={algorithmType} onValueChange={setAlgorithmType}>
            <SelectTrigger className="bg-card dark:bg-muted-dark text-foreground dark:text-foreground-dark">
              <SelectValue placeholder="Select AES Encryption Type" />
            </SelectTrigger>
            <SelectContent className="bg-card dark:bg-card-dark text-foreground dark:text-foreground-dark">
              <SelectItem value="AES-128">
                AES - 128 (16 character Passphrase)
              </SelectItem>
              <SelectItem value="AES-192">
                AES - 192 (24 character Passphrase)
              </SelectItem>
              <SelectItem value="AES-256">
                AES - 256 (32 character Passphrase)
              </SelectItem>
            </SelectContent>
          </Select>
        </>
      )}
    </>
  );
}
