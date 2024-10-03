// components/keyring-management/PassphraseDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      <DialogContent>
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
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Decrypt</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
