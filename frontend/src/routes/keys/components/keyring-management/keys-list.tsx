import { Card, CardContent } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useToast } from "@/hooks/use-toast";
import { pgpfs } from "@wailsjs/go/models";
import {
  RetrieveKeyMoreInfo,
  RetrievePgpFingerprint,
  RetrievePgpPubKey,
} from "@wailsjs/go/pgpfs/PgpRetrieve";
import { LogError, LogInfo } from "@wailsjs/runtime/runtime";
import React from "react";
import KeyMoreInfo from "./KeyMoreInfo";
import { PGPInfo } from "@/lib/types/keys";

export default function ListKeys({ keys }: { keys: pgpfs.PgpKeyInfo[] }) {
  const [keyMoreInfo, setKeyMoreInfo] = React.useState<PGPInfo | null>(null);

  const { toast } = useToast();

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

  const handleRetrieveKeyInfo = async (folderPath: string) => {
    try {
      setKeyMoreInfo(null);
      const keyInfo = await RetrieveKeyMoreInfo(folderPath);
      setKeyMoreInfo(keyInfo);
    } catch (error) {
      LogError(`Failed to retrieve key information: ${error}`);
      setKeyMoreInfo(null);
    }
  };

  return (
    <div className="p-6 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
      <div className="grid gap-4">
        {keys.map((key) => (
          <ContextMenu key={key.name}>
            <ContextMenuTrigger asChild>
              <Card
                onClick={() => handleRetrieveKeyInfo(key.folderPath)}
                className="shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer"
              >
                <CardContent className="flex bg-background dark:bg-background-dark justify-between items-center p-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {key.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {key.type}
                  </span>
                </CardContent>
              </Card>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onSelect={() => handleAction("copyPublic", key)}>
                Copy Public Key
              </ContextMenuItem>
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
        {keyMoreInfo && <KeyMoreInfo keyInfo={keyMoreInfo} />}
      </div>
    </div>
  );
}
