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
import {
  RetrievePgpPrivKey,
  RetrievePgpPubKey,
} from "@wailsjs/go/keys/KeyRetrieve";
import { GeneratePGPKeys } from "@wailsjs/go/keys/PgpKeysGen";
import { LogError } from "@wailsjs/runtime/runtime";
import React from "react";

type Props = {
  setPrivKey: (value: string) => void;
  setPubKey: (value: string) => void;
};

export function PgpKeyGen({ setPrivKey, setPubKey }: Props) {
  const [keyName, setKeyName] = React.useState<string>("");
  const [passphrase, setPassphrase] = React.useState<string>("");
  const { toast } = useToast();

  const genKeys = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await GeneratePGPKeys({
        Usage: keyName,
        Passphrase: passphrase,
      });

      if (response.PubKey && response.PrivKey) {
        try {
          const publicKey = await RetrievePgpPubKey(keyName);
          setPubKey(publicKey);

          const privateKey = await RetrievePgpPrivKey(keyName);
          setPrivKey(privateKey);

          toast({
            variant: "default",
            className: "bg-green-500 border-0",
            title: "Keys Generated Successfully",
            description:
              "Public and private keys have been generated and retrieved.",
          });
        } catch (error) {
          LogError("Error retrieving keys");
          toast({
            variant: "destructive",
            className: "bg-red-500 border-0",
            title: "Uh oh! Something went wrong.",
            description: "Error retrieving one or both keys.",
          });
        }
      }
    } catch (err) {
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Uh oh! Something went wrong.",
        description:
          "Failed to generate keys. Please check if you initialized folder path.",
      });
    } finally {
      setKeyName("");
      setPassphrase("");
    }
  };

  // the folderName for those keys
  // should associate for what the keys
  // are being used (thats what we need to show)

  // add in here folder path input where keys
  // will be stored
  // live preview of where the keys is stored
  //
  // when user confirms the path
  // we should prompt the passphrase

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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Keys</DialogTitle>
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
                onChange={(e) => setKeyName(e.target.value)}
                id="keyName"
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
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!passphrase || !keyName}>
              Generate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
