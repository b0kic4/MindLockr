import { CustomDecryptButton } from "@/components/shared/decryption/CustomButtonDecryptDialog";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { usePrivateKeyDecryption } from "@/hooks/keys/usePrivateKeyDecryption";
import { pgpfs } from "@wailsjs/go/models";
import { RetrievePgpPubKey } from "@wailsjs/go/pgpfs/PgpRetrieve";
import { LogError, LogInfo } from "@wailsjs/runtime/runtime";
import React from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

export default function ListKeys({ keys }: { keys: pgpfs.PgpKeyInfo[] }) {
  const [selectedKey, setSelectedKey] = React.useState<pgpfs.PgpKeyInfo | null>(
    null,
  );
  const [copied, setCopied] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [keyPath, setKeyPath] = React.useState<string>("");

  const { handleDecryptPrivKey, decryptedPrivKey, handleHidePrivKey } =
    usePrivateKeyDecryption({ keyPath });

  React.useEffect(() => {
    if (selectedKey) {
      setKeyPath(selectedKey.folderPath);
      LogInfo(`Key path selected: ${selectedKey.folderPath}`);
    }
  }, [selectedKey]);

  // Handle copying the private key to clipboard
  const handleCopy = () => {
    if (decryptedPrivKey) {
      navigator.clipboard
        .writeText(decryptedPrivKey)
        .then(() => {
          LogInfo("Private key copied to clipboard");
          setCopied(true); // Update the copied state
          handleHidePrivKey();
        })
        .catch((err) => {
          LogError(`Failed to copy to clipboard: ${err}`);
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
          .then(() => LogInfo("Public key copied to clipboard"))
          .catch((err) => LogError(`Failed to copy to clipboard: ${err}`));
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
        console.log("Copy fingerprint:", key);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col line">
      <div className="flex px-4 py-2 justify-around text-black dark:text-white font-bold">
        <span className="w-1/3">Key Name</span>
        <span className="w-1/3">Type</span>
        <span className="w-1/3">Created</span>
        <span className="w-1/3">Expires</span>
        <span className="w-1/3">User</span>
      </div>

      {keys.map((key) => (
        <ContextMenu key={key.name}>
          <ContextMenuTrigger onContextMenu={() => setSelectedKey(key)}>
            <div className="flex px-4 py-2 justify-around items-center cursor-pointer border-b">
              <span className="w-1/3">{key.name}</span>
              <span className="w-1/3"></span>
              <span className="w-1/3"></span>
            </div>
          </ContextMenuTrigger>

          <ContextMenuContent>
            <ContextMenuItem onSelect={() => handleAction("copyPublic", key)}>
              Copy Public Key
            </ContextMenuItem>

            <div className="flex flex-col space-y-2">
              {!decryptedPrivKey && (
                <CustomDecryptButton
                  keyName={key.name}
                  onSubmit={(passphrase) => {
                    setLoading(true);
                    handleDecryptPrivKey(passphrase);
                  }}
                />
              )}
              {decryptedPrivKey && (
                <Button
                  onClick={handleCopy}
                  variant={"ghost"}
                  className="flex text-center items-center justify-center gap-2 text-sm text-green-500 px-2 py-1  rounded transition"
                >
                  Copy Private Key
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
