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
import {
  GeneratePrivatePublicKeys,
  RetrievePrivKey,
  RetrievePubKey,
} from "@wailsjs/go/keys/PubPrvKeyGen";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { LogError } from "@wailsjs/runtime/runtime";

type Props = {
  setPrivKey: (value: string) => void;
  setPubKey: (value: string) => void;
};

export function PubPrivKeyGen({ setPrivKey, setPubKey }: Props) {
  const [passphrase, setPassphrase] = React.useState<string>("");
  const { toast } = useToast();

  const genKeys = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await GeneratePrivatePublicKeys({
        Passphrase: passphrase,
      });

      if (response.PubKey && response.PrivKey) {
        try {
          const publicKey = await RetrievePubKey();
          setPubKey(publicKey);

          const privateKey = await RetrievePrivKey();
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

      setPassphrase("");
    } catch (err) {
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Uh oh! Something went wrong.",
        description:
          "Failed to generate keys. Please check if you initialized folder path.",
      });
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
      <DialogContent className="sm:max-w-[425px]">
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
            <Button type="submit" disabled={!passphrase}>
              Generate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
