import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { KeyRound } from "lucide-react";
import React from "react";

interface PassphraseDialogProps {
  onSubmit: (passphrase: string) => void;
  keyName: string;
  onClose: () => void;
}

export const PassphraseDialog: React.FC<PassphraseDialogProps> = ({
  onSubmit,
  keyName,
  onClose,
}) => {
  const [passphrase, setPassphrase] = React.useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(passphrase);
    setPassphrase("");
  };

  return (
    <Dialog>
      <DialogTrigger>
        <KeyRound className="w-5 h-5 text-green-500 hover:text-green-500 text-center" />
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
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
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
