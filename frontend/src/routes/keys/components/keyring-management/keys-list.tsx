import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { keys } from "@wailsjs/go/models";

export default function ListKeys({ keys }: { keys: keys.PgpKeyInfo[] }) {
  const handleAction = (action: string, key: keys.PgpKeyInfo) => {
    switch (action) {
      case "copyPublic":
        console.log("Copy public key:", key);
        break;
      case "copyPrivate":
        console.log("Copy private key:", key);
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
    <div className="space-y-2">
      {keys.map((key: keys.PgpKeyInfo) => (
        <ContextMenu key={key.name}>
          <ContextMenuTrigger>
            <div className="p-4 border rounded-md cursor-pointer">
              {key.name} ({key.type})
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onSelect={() => handleAction("copyPublic", key)}>
              Copy
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => handleAction("copyPrivate", key)}>
              Copy Private Key
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
    </div>
  );
}
