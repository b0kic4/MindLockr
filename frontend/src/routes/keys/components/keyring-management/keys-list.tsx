import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { usePrivateKeyDecryption } from "@/hooks/keys/usePrivateKeyDecryption";
import { pgpfs } from "@wailsjs/go/models";
import {
  RetrievePgpPubKey,
  RetrievePgpFingerprint,
} from "@wailsjs/go/pgpfs/PgpRetrieve";
import { LogError, LogInfo } from "@wailsjs/runtime/runtime";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { PacmanLoader } from "react-spinners";

export default function ListKeys({ keys }: { keys: pgpfs.PgpKeyInfo[] }) {
  const [selectedKey, setSelectedKey] = React.useState<pgpfs.PgpKeyInfo | null>(
    null,
  );
  const [keyPath, setKeyPath] = React.useState<string>("");
  const [isClicked, setIsClicked] = React.useState<boolean>(false);
  const [passphrase, setPassphrase] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { handleDecryptPrivKey, decryptedPrivKey, isDec, handleHidePrivKey } =
    usePrivateKeyDecryption({ keyPath });

  React.useEffect(() => {
    if (selectedKey) {
      setKeyPath(selectedKey.folderPath);
      LogInfo(`Key path selected: ${selectedKey.folderPath}`);
    }
  }, [selectedKey]);

  const { toast } = useToast();

  const handleCopy = () => {
    if (decryptedPrivKey) {
      navigator.clipboard
        .writeText(decryptedPrivKey)
        .then(() => {
          handleHidePrivKey();
          setIsClicked(false);
          toast({
            variant: "default",
            className: "bg-green-500 border-0",
            title: "Private key copied successfully",
            description: "Private key is in your clipboard",
          });
        })
        .catch((err) => {
          LogError(`Failed to copy to clipboard: ${err}`);
          const errorMessage =
            err instanceof Error
              ? err.message
              : typeof err === "string"
                ? err
                : JSON.stringify(err);

          toast({
            variant: "destructive",
            className: "bg-red-500 border-0",
            title: "Failed to copy private key into your clipboard",
            description: errorMessage,
          });
        });
    }
  };

  // Action handler for context menu items
  const handleAction = async (action: string, key: pgpfs.PgpKeyInfo) => {
    switch (action) {
      case "copyPublic":
        const publicKey = await RetrievePgpPubKey(key.folderPath);
        navigator.clipboard
          .writeText(publicKey)
          .then(() => {
            LogInfo("Public key copied to clipboard");
            toast({
              variant: "default",
              className: "bg-green-500 border-0",
              title: "Public key copied successfully",
              description: "Public key is in your clipboard",
            });
          })
          .catch((err) => {
            LogError(`Failed to copy to clipboard: ${err}`);
            const errorMessage =
              err instanceof Error
                ? err.message
                : typeof err === "string"
                  ? err
                  : JSON.stringify(err);

            toast({
              variant: "destructive",
              className: "bg-red-500 border-0",
              title: "Failed to copy public key into your clipboard",
              description: errorMessage,
            });
          });
        break;
      case "delete":
        console.log("Delete key pair:", key);
        break;
      case "edit":
        console.log("Edit key:", key);
        break;
      case "export":
        console.log("Export key:", key);
        break;
      case "copyFingerprint":
        const fingerprint = await RetrievePgpFingerprint(key.folderPath);
        navigator.clipboard
          .writeText(fingerprint)
          .then(() => {
            LogInfo("Fingerprint copied to clipboard");
            toast({
              variant: "default",
              className: "bg-green-500 border-0",
              title: "Fingerprint copied successfully",
              description: "Fingerprint is in your clipboard",
            });
          })
          .catch((err) => {
            LogError(`Failed to copy to clipboard: ${err}`);
            const errorMessage =
              err instanceof Error
                ? err.message
                : typeof err === "string"
                  ? err
                  : JSON.stringify(err);

            toast({
              variant: "destructive",
              className: "bg-red-500 border-0",
              title: "Failed to copy fingerprint into your clipboard",
              description: errorMessage,
            });
          });
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state
    await handleDecryptPrivKey(passphrase); // Decrypt private key
    setIsLoading(false); // Reset loading state after completion
  };

  return (
    <div className="flex flex-col line">
      <div className="flex px-4 py-2 justify-around text-black dark:text-white font-bold">
        <span className="w-1/3">Key Name</span>
        <span className="w-1/3">Type</span>
        <span className="w-1/3">Path</span>
      </div>

      {keys.map((key) => (
        <ContextMenu key={key.name}>
          <ContextMenuTrigger onContextMenu={() => setSelectedKey(key)}>
            <div className="flex px-4 py-2 justify-around items-center cursor-pointer border-b">
              <span className="w-1/3">{key.name}</span>
              <span className="w-1/3">{key.type}</span>
              <span className="w-1/3 text-xs">{key.folderPath}</span>
            </div>
          </ContextMenuTrigger>

          <ContextMenuContent className="w-full">
            <ContextMenuItem onSelect={() => handleAction("copyPublic", key)}>
              Copy Public Key
            </ContextMenuItem>

            <div className="flex flex-col">
              {!decryptedPrivKey && !isClicked && (
                <Button
                  variant={"ghost"}
                  className="flex text-center items-center justify-center text-sm text-green-500 px-2 py-1 rounded transition"
                  onClick={() => setIsClicked(true)}
                >
                  Copy Private Key
                </Button>
              )}

              {!decryptedPrivKey && isClicked && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4 border-2">
                    <Input
                      type="password"
                      placeholder="Decryption passphrase"
                      value={passphrase}
                      onChange={(e) => setPassphrase(e.target.value)}
                      required
                      className="w-full border-0 placeholder:text-sm"
                    />
                    <Button
                      type="submit"
                      className="text-sm"
                      variant={"ghost"}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <PacmanLoader size={8} color="#fff" />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {decryptedPrivKey && isDec && (
                <Button
                  onClick={handleCopy}
                  variant={"ghost"}
                  className="flex text-center items-center justify-center text-sm text-green-500 px-2 py-1 rounded transition"
                >
                  Copy
                </Button>
              )}
            </div>

            <ContextMenuSeparator />
            <ContextMenuItem onSelect={() => handleAction("delete", key)}>
              Delete Key Pair
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => handleAction("edit", key)}>
              Edit
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => handleAction("export", key)}>
              Export
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onSelect={() => handleAction("copyFingerprint", key)}
            >
              Copy Fingerprint
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </div>
  );
}
