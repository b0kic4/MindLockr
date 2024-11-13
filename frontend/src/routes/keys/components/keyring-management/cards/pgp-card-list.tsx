import { Card, CardContent } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "@/hooks/use-toast";
import { FileInfo, PGPInfo } from "@/lib/types/keys";
import {
  RetrievePgpFingerprint,
  RetrievePgpPubKey,
} from "@wailsjs/go/pgpfs/PgpRetrieve";
import { LoadAsymEnData, RetrievePGPMsgInfo } from "@wailsjs/go/en/EnRetrieve";
import { LogError, LogInfo } from "@wailsjs/runtime/runtime";
import React from "react";
import PGPMessageInfo from "./pgp-more-info";

interface PGPCardListProps {
  data: FileInfo[];
}

const handleCopy = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast({
        variant: "default",
        className: "bg-green-500 border-0",
        title: "Copied successfully",
        description: "The data has been copied to your clipboard",
      });
    })
    .catch((err) => {
      LogError(`Failed to copy to clipboard: ${err}`);
      const errorMessage =
        err instanceof Error ? err.message : JSON.stringify(err);
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Failed to copy",
        description: errorMessage,
      });
    });
};

const handleAction = async (action: string, key: FileInfo) => {
  switch (action) {
    case "copy":
      const armor = await LoadAsymEnData(key.path);
      handleCopy(armor);
      break;
    case "copyPublic":
      const publicKey = await RetrievePgpPubKey(key.path);
      handleCopy(publicKey);
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
      const fingerprint = await RetrievePgpFingerprint(key.path);
      handleCopy(fingerprint);
      break;
    default:
      break;
  }
};

export function HybridCardList({ data }: PGPCardListProps) {
  const [msgData, setMsgData] = React.useState<PGPInfo | null>(null);

  const moreInfo = async (item: FileInfo) => {
    try {
      setMsgData(null);
      const data = await RetrievePGPMsgInfo(item.path);
      setMsgData(data);
    } catch (error) {
      LogError(`Failed to retrieve key information: ${error}`);
      setMsgData(null);
    }
  };

  return (
    <div className="flex-col">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <ContextMenu key={item.name}>
            <ContextMenuTrigger asChild>
              <Card
                onClick={() => moreInfo(item)}
                className="shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer"
              >
                <CardContent className="flex bg-background dark:bg-background-dark justify-between items-center p-4">
                  {item.name}
                </CardContent>
              </Card>
            </ContextMenuTrigger>

            <ContextMenuContent>
              <ContextMenuItem onSelect={() => handleAction("copy", item)}>
                Copy
              </ContextMenuItem>

              <ContextMenuItem
                onSelect={() => handleAction("copyPublic", item)}
              >
                Copy Public Key
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onSelect={() => handleAction("delete", item)}>
                Delete Key Pair
              </ContextMenuItem>
              <ContextMenuItem onSelect={() => handleAction("edit", item)}>
                Edit
              </ContextMenuItem>
              <ContextMenuItem onSelect={() => handleAction("export", item)}>
                Export
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem
                onSelect={() => handleAction("copyFingerprint", item)}
              >
                Copy Fingerprint
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
      <div className="flex-row">
        {msgData && <PGPMessageInfo msgData={msgData} />}
      </div>
    </div>
  );
}
