import React, { useState, useEffect, useRef } from "react";
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
import { LogInfo } from "@wailsjs/runtime/runtime";

// Dialog component to handle passphrase input for decryption
interface PassphraseDialogProps {
  onSubmit: (passphrase: string) => void;
  keyName: string;
}

export const CustomDecryptButton: React.FC<PassphraseDialogProps> = ({
  onSubmit,
  keyName,
}) => {
  const [passphrase, setPassphrase] = useState("");
  const [isOpen, setIsOpen] = useState(false); // manage open state

  // Reference to capture ESC key press
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(passphrase);
    setPassphrase(""); // Reset passphrase
    setIsOpen(false); // Close the dialog after submitting
  };

  // Handle ESC key press to close the dialog
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Listen for ESC key press when the dialog is open
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="relative flex cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          variant={"ghost"}
          onClick={() => setIsOpen(true)} // Open dialog on click
        >
          Get Private Key
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
