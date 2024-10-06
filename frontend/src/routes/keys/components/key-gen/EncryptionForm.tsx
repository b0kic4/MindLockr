import { Input } from "@/components/ui/input";

type Props = {
  data: string;
  setData: (value: string) => void;
  passphrase: string;
  setPassphrase: (value: string) => void;
};

export default function EncryptionForm({
  data,
  setData,
  passphrase,
  setPassphrase,
}: Props) {
  return (
    <>
      <Input
        type="text"
        placeholder="Data to be encrypted"
        value={data}
        onChange={(e) => setData(e.target.value)}
        className="mb-2 bg-card dark:bg-muted-dark text-foreground dark:text-foreground-dark"
      />
      <Input
        type="password"
        placeholder="Passphrase for Encryption"
        value={passphrase}
        onChange={(e) => setPassphrase(e.target.value)}
        className="mb-2 bg-card dark:bg-muted-dark text-foreground dark:text-foreground-dark"
      />
    </>
  );
}
