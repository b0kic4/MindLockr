import { PassphraseDialog } from "@/components/shared/decryption/EnterPassphraseDialog";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { useKeys } from "@/hooks/keyring-management/useKeys";
import { useToast } from "@/hooks/use-toast";
import { KeyInfo } from "@/lib/types/keys";
import { decryptData } from "@/lib/utils/decryptionUtils";
import { TextSearchIcon } from "lucide-react";
import React from "react";
import {
  DeleteKey,
  LoadEncryptedKeyContent,
} from "../../../wailsjs/go/keys/KeyRetrieve";
import { getKeyColumns } from "./components/keyring-management/KeyColumns";
import { KeyTypeFilter } from "./components/keyring-management/KeyTypeFilter";

export default function KeyringManagement() {
  const { keys, fetchKeys } = useKeys();
  const [filterKeyType, setFilterKeyType] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedKey, setSelectedKey] = React.useState<KeyInfo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<"edit" | "decrypt" | null>(
    null,
  );
  const { toast } = useToast();

  const handleEdit = (key: KeyInfo) => {
    setSelectedKey(key);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleDecrypt = (key: KeyInfo) => {
    setSelectedKey(key);
    setDialogMode("decrypt");
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedKey(null);
    setDialogMode(null);
  };

  const handleEditPassphraseSubmit = async (passphrase: string) => {
    if (selectedKey) {
      try {
        const encryptedData = await LoadEncryptedKeyContent(
          selectedKey.name,
          selectedKey.algorithm,
        );

        const decryptedData = await decryptData({
          algorithm: selectedKey.algorithm,
          encryptedData,
          passphrase,
        });

        if (decryptedData.length > 0) {
          toast({
            variant: "default",
            title: "Key decrypted successfully",
            description: "You can now edit the key.",
          });
          handleDialogClose();
        } else {
          toast({
            variant: "destructive",
            title: "Decryption failed",
            description: "Incorrect passphrase or corrupted data.",
          });
        }
      } catch (error) {
        console.error("Decryption failed:", error);
        toast({
          variant: "destructive",
          title: "Decryption failed",
          description: "An error occurred during decryption.",
        });
      }
    }
  };

  const handleDecryptPassphraseSubmit = async (passphrase: string) => {
    if (selectedKey) {
      try {
        const encryptedData = await LoadEncryptedKeyContent(
          selectedKey.name,
          selectedKey.algorithm,
        );

        const decryptedData = await decryptData({
          algorithm: selectedKey.algorithm,
          encryptedData,
          passphrase,
        });

        if (decryptedData.length > 0) {
          toast({
            variant: "default",
            title: "Results",
            description: decryptedData,
          });
          handleDialogClose();
        } else {
          toast({
            variant: "destructive",
            title: "Decryption failed",
            description: "Incorrect passphrase or corrupted data.",
          });
        }
      } catch (error) {
        console.error("Decryption failed:", error);
        toast({
          variant: "destructive",
          title: "Decryption failed",
          description: "An error occurred during decryption.",
        });
      }
    }
  };

  const handleDelete = async (key: KeyInfo) => {
    const response = await DeleteKey(key);
    if (response) {
      fetchKeys();
      toast({
        variant: "default",
        className: "border-0",
        title: "Key deleted successfully",
      });
    } else {
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Uh oh! Something went wrong.",
        description: "Deletion of the key has failed.",
      });
    }
  };

  const columns = React.useMemo(
    () => getKeyColumns(handleEdit, handleDelete, handleDecrypt),
    [handleEdit, handleDelete, handleDecrypt],
  );

  const filteredKeys = keys
    .filter((key) => {
      if (filterKeyType === "Symmetric" || filterKeyType === "Asymmetric") {
        return key.type === filterKeyType;
      }
      return true;
    })
    .filter((key) => {
      if (searchQuery === "") return true;
      return key.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

  return (
    <div className="p-6 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
      <h2 className="text-2xl font-bold mb-4">Keyring Management</h2>
      {keys.length > 0 ? (
        <div className="mb-4">
          <div className="mb-4 flex items-center gap-3 max-w-lg">
            <KeyTypeFilter
              filterKeyType={filterKeyType}
              setFilterKeyType={setFilterKeyType}
            />
            <div className="relative flex items-center text-foreground dark:text-foreground-dark">
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 text-gray-400">
                <TextSearchIcon />
              </div>
            </div>
          </div>
          <DataTable data={filteredKeys} columns={columns} />
          {selectedKey && isDialogOpen && (
            <PassphraseDialog
              isOpen={isDialogOpen}
              onClose={handleDialogClose}
              onSubmit={
                dialogMode === "edit"
                  ? handleEditPassphraseSubmit
                  : handleDecryptPassphraseSubmit
              }
              keyName={selectedKey.name}
            />
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-muted">
            No keys found. Please add or retrieve keys.
          </p>
        </div>
      )}
    </div>
  );
}
