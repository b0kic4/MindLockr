import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React from "react";

interface PassphraseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (passphrase: string) => void;
  keyName: string;
}

export const PassphraseDialog: React.FC<PassphraseDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  keyName,
}) => {
  const [passphrase, setPassphrase] = React.useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(passphrase);
    setPassphrase("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent className="bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark dark:border-0">
        <DialogHeader>
          <DialogTitle>Decrypt Key: {keyName}</DialogTitle>
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
            <Button type="submit">Decrypt</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
