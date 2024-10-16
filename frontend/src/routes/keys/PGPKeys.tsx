import React from "react";
import { GeneratePrivatePublicKeys } from "@wailsjs/go/keys/PubPrvKeyGen";
import { useToast } from "@/hooks/use-toast";
import { LogError, LogInfo } from "@wailsjs/runtime/runtime";
import usePgpKeysStore from "@/lib/store/usePgpKeysStore";
import { usePgpKeys } from "@/hooks/keys/usePgpKeys";

export default function PGPKeys() {
  const [keyName, setKeyName] = React.useState<string>("");
  const [passphrase, setPassphrase] = React.useState<string>("");
  const { toast } = useToast();

  const { pgpKeys, fetchPgpKeys } = usePgpKeys();
  const { addPgpKey } = usePgpKeysStore();

  // Generating new PGP key pair
  const genKeys = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await GeneratePrivatePublicKeys({
        Usage: keyName,
        Passphrase: passphrase,
      });

      if (response.PubKey && response.PrivKey) {
        // Optionally, retrieve the generated keys
        // const publicKey = await RetrievePgpPubKey(keyName);
        // const privateKey = await RetrievePgpPrivKey(keyName);

        // Add the new key to the store
        addPgpKey(keyName);

        // Refresh the keys list
        fetchPgpKeys();

        toast({
          variant: "default",
          className: "bg-green-500 border-0",
          title: "Keys Generated Successfully",
          description:
            "Public and private keys have been generated and retrieved.",
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
      setKeyName("");
      setPassphrase("");
    }
  };

  return (
    <div>
      <h2>PGP Keys List</h2>
      {pgpKeys.length > 0 ? (
        <ul>
          {pgpKeys.map((keyName) => (
            <li key={keyName.name}>{keyName.folderPath}</li>
          ))}
        </ul>
      ) : (
        <p>No PGP keys available.</p>
      )}
    </div>
  );
}
