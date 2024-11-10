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
import { GeneratePGPKeys } from "@wailsjs/go/pgpgen/PgpKeysGen";
import { LogError } from "@wailsjs/runtime/runtime";
import React from "react";
import SelectAlg from "../PGP/SelectAlgorithm";
import NumberOfBitsRSA from "../PGP/SelectNumberOfBitsForRSA";
import { PacmanLoader } from "react-spinners";
import SelectCurve from "../PGP/SelectCurve";
import useSelectCurve from "@/lib/store/useSelectCurve";

type Props = {
  fetchPgpKeys: () => void;
};

export function PgpKeysGenForm({ fetchPgpKeys }: Props) {
  const [keyName, setKeyName] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [passphrase, setPassphrase] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();

  const { selectedAlg, clearSelectedAlg } = useSelectAlgPgpGen();
  const { selectedBits, clearSelectedBits } = useSelectNumOfBits();
  const { selectedCurve, clearSelectedCurve } = useSelectCurve();

  const genKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await GeneratePGPKeys({
        Name: name,
        Email: email,
        EnType: selectedAlg,
        Usage: keyName,
        Passphrase: passphrase,
        Bits: selectedBits,
        Curve: selectedCurve,
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
      clearSelectedCurve();
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
                placeholder="Provide a key name that reflects its intended usage."
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

              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                value={name}
                id="name"
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="col-span-3"
                placeholder="Optional: Provide a name to help identify its usage."
              />

              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                value={email}
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                className="col-span-3"
                placeholder="Optional: Your email helps others verify your key, but it's not required."
              />

              <small className="col-span-4 text-gray-500 text-left pl-2">
                You don’t have to provide your real name or email. This
                information is only used to help identify and verify the key
                when it's shared with others. If you prefer, you can use an
                alias or leave these fields blank.
              </small>

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

              {selectedAlg === "ECC" && (
                <>
                  <Label htmlFor="bits" className="text-right">
                    Number of Bits
                  </Label>
                  <div className="col-span-3">
                    <SelectCurve />
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
