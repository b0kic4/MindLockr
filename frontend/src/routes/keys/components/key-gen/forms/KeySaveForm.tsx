import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  keyFileName: string;
  setKeyFileName: (value: string) => void;
  handleSaveKey: () => void;
};

export default function KeySaveForm({
  keyFileName,
  setKeyFileName,
  handleSaveKey,
}: Props) {
  return (
    <div>
      <p className="text-lg">If you need key for later, save it :)</p>
      <div className="flex justify-center gap-2">
        <Input
          type="text"
          placeholder="Enter the name for the key file"
          value={keyFileName}
          onChange={(e) => setKeyFileName(e.target.value)}
          className="bg-card dark:bg-muted-dark text-foreground dark:text-foreground-dark max-w-sm"
        />
        <Button
          onClick={handleSaveKey}
          className="self-end bg-green-700 hover:bg-green-800 text-white p-2 rounded-lg"
        >
          Save Key
        </Button>
      </div>
    </div>
  );
}
