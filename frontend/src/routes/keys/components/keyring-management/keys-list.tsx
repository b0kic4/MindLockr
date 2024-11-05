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
        // we should call the RetrievePgpPublicKey
        console.log("Copy public key:", key);
        break;
      case "copyPrivate":
        // we should call the RetrievePgpPrivateKey
        console.log("Copy private key:", key);
        break;
      case "delete":
        console.log("Delete key pair:", key);
        break;
      case "edit":
        // in here expiration should be handled
        console.log("Edit key:", key);
        break;
      case "export":
        console.log("Export key:", key);
        break;
      case "copyFingerprint":
        // We need to implement this
        // first load the public key and then get the fingerprint
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
          <ContextMenuTrigger>
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
