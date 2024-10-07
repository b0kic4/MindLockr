import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GeneratePrivatePublicKeys } from "@wailsjs/go/keys/PubPrvKeyGen";
import React from "react";

type Props = {
  setPrivKey: (value: string) => void;
  setPubKey: (value: string) => void;
};

export function PubPrivKeyGen({ setPrivKey, setPubKey }: Props) {
  const [passphrase, setPassphrase] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);

  const genKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await GeneratePrivatePublicKeys({
        Passphrase: passphrase,
      });

      setPrivKey(JSON.stringify(response.PrivKey));
      setPubKey(JSON.stringify(response.PubKey));

      setPassphrase("");
    } catch (err) {
      setError("Failed to generate keys. Please try again.");
      console.error("Error generating keys:", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 shadow-lg transition-all"
          variant="default"
        >
          Generate Keys
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate keys</DialogTitle>
          <DialogDescription>
            You'r private key will be encrypted provide the passphrase for it
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="passphrase" className="text-right">
              Passphrase
            </Label>
            <Input
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              id="passphrase"
              type="password"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={genKeys}>Generate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
