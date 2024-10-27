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
import { useToast } from "@/hooks/use-toast";
import useSelectAlgPgpGen from "@/lib/store/useSelectAlgPgpGen";
import useSelectNumOfBits from "@/lib/store/useSelectNumberOfBits";
import { GeneratePGPKeys } from "@wailsjs/go/keys/PgpKeysGen";
import { LogError } from "@wailsjs/runtime/runtime";
import React from "react";
import SelectAlg from "./SelectAlgorithm";
import NumberOfBitsRSA from "./SelectNumberOfBitsForRSA";
import { PacmanLoader } from "react-spinners";

type Props = {
  fetchPgpKeys: () => void;
};

export function PgpKeysGenForm({ fetchPgpKeys }: Props) {
  const [keyName, setKeyName] = React.useState<string>("");
  const [passphrase, setPassphrase] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();

  const { selectedAlg, clearSelectedAlg } = useSelectAlgPgpGen();
  const { selectedBits, clearSelectedBits } = useSelectNumOfBits();

  const genKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await GeneratePGPKeys({
        EnType: selectedAlg,
        Usage: keyName,
        Passphrase: passphrase,
        Bits: selectedBits,
      });

      if (response.PubKey && response.PrivKey) {
        fetchPgpKeys();

        toast({
          variant: "default",
          className: "bg-green-500 border-0",
          title: "Keys Generated Successfully",
          description: "PGP keys have been generated and retrieved.",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : JSON.stringify(err);
      LogError("Failed to generate keys: " + errorMessage);
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Uh oh! Something went wrong.",
        description:
          "Failed to generate keys. Please check if you initialized folder path.",
      });
    } finally {
      setIsLoading(false);
      setKeyName("");
      setPassphrase("");
      clearSelectedBits();
      clearSelectedAlg();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 shadow-lg transition-all"
          variant="default"
        >
          Generate New PGP Keys
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Your PGP Keys</DialogTitle>
          <DialogDescription>
            Your private key will be encrypted. Please provide a passphrase for
            encryption.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={genKeys}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="keyName" className="text-right">
                Key Name
              </Label>
              <Input
                value={keyName}
                id="keyName"
                onChange={(e) => setKeyName(e.target.value)}
                type="text"
                className="col-span-3"
                placeholder="Please provide a key name that reflects its intended usage."
              />
              <Label htmlFor="passphrase" className="text-right">
                Passphrase
              </Label>
              <Input
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                id="passphrase"
                type="password"
                className="col-span-3"
                placeholder="Enter passphrase"
              />
              <Label htmlFor="algorithm" className="text-right">
                Algorithm
              </Label>
              <div className="col-span-3">
                <SelectAlg />
              </div>
              {selectedAlg === "RSA" && (
                <>
                  <Label htmlFor="bits" className="text-right">
                    Number of Bits
                  </Label>
                  <div className="col-span-3">
                    <NumberOfBitsRSA />
                  </div>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!passphrase || !keyName || !selectedAlg || isLoading} // Disable when loading
            >
              {isLoading ? <PacmanLoader size={8} color="#fff" /> : "Generate"}{" "}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
