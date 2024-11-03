import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { KeyInfo } from "@/lib/types/keys";
import { LoadEncryptedKeyContent } from "@wailsjs/go/keys/KeyRetrieve";
import { DecryptAES } from "@wailsjs/go/symmetricdecryption/Cryptography";
import React, { useState } from "react";
import { PacmanLoader } from "react-spinners";

interface DecryptedDataProps {
  keyInfo: KeyInfo;
  onClose: () => void;
}

const DecryptedDataComponent: React.FC<DecryptedDataProps> = ({
  keyInfo,
  onClose,
}) => {
  const [decryptedData, setDecryptedData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [passphrase, setPassphrase] = useState("");

  const handleDecryptPassphraseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const encryptedData = await LoadEncryptedKeyContent(keyInfo.name);

      const decrypted = await DecryptAES({
        encryptedData,
        passphrase,
      });

      setDecryptedData(decrypted);
    } catch (error) {
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Decryption failed",
        description: "An error occurred during decryption.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark dark:border-0">
        <DialogHeader>
          <DialogTitle>
            Decrypt Key: {keyInfo.name.slice(0, 10) + "..."}
          </DialogTitle>
        </DialogHeader>

        {!decryptedData ? (
          <>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <PacmanLoader size={8} color="#fff" />
              </div>
            ) : (
              <form onSubmit={handleDecryptPassphraseSubmit}>
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
                  <Button type="submit">Decrypt</Button>
                  <DialogClose asChild>
                    <Button variant="ghost" onClick={onClose}>
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            )}
          </>
        ) : (
          <div className="p-4 bg-gray-100 rounded-md">
            <pre className="whitespace-pre-wrap text-gray-700">
              {decryptedData}
            </pre>
          </div>
        )}

        {decryptedData && (
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DecryptedDataComponent;
