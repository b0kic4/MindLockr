import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React from "react";

interface PassphraseDialogProps {
  onSubmit: (passphrase: string) => void;
  keyName: string;
}

export const CustomDecryptButton: React.FC<PassphraseDialogProps> = ({
  onSubmit,
  keyName,
}) => {
  const [passphrase, setPassphrase] = React.useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(passphrase);
    setPassphrase("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-sm p-1 text-red-500 underline">
          Decrypt private key
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark dark:border-0">
        <DialogHeader>
          <DialogTitle>Decrypt Key: {keyName.slice(0, 10) + "..."}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <Input
              type="password"
              placeholder="Enter Passphrase"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <DialogClose>
              <Button type="submit">Decrypt</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
