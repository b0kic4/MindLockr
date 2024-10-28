import DecryptedDataComponent from "@/components/shared/decryption/ShowDecryptedData";
import ShareSymEnc from "@/components/shared/encryption/ShareSymEnc";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { KeyInfo } from "@/lib/types/keys";
import { Portal } from "@radix-ui/react-portal";
import { createColumnHelper } from "@tanstack/react-table";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import DeleteKeyDialog from "./DeleteKeyDialog";

export const getKeyColumns = (handleDelete: (key: KeyInfo) => void) => {
  const columnHelper = createColumnHelper<KeyInfo>();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentKey, setCurrentKey] = useState<KeyInfo | null>(null);

  const handleOpenDialog = (key: KeyInfo) => {
    setCurrentKey(key);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentKey(null);
  };

  return [
    columnHelper.accessor("name", {
      header: "Key Name",
      cell: (info) => info.getValue(),
      meta: { align: "left" },
    }),
    columnHelper.accessor("algorithm", {
      header: "Algorithm",
      cell: (info) => info.getValue(),
      meta: { align: "left" },
    }),
    columnHelper.accessor("type", {
      header: "Key Type",
      cell: (info) => info.getValue(),
      meta: { align: "left" },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-4 justify-center items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <button
                  aria-label="Decrypt"
                  onClick={() => handleOpenDialog(row.original)}
                >
                  <KeyRound className="w-5 h-5 text-green-500 hover:text-green-500" />
                </button>
              </TooltipTrigger>
              <Portal>
                <TooltipContent className="z-50 p-2 bg-white">
                  <p className="text-sm">Decrypt</p>
                </TooltipContent>
              </Portal>
            </Tooltip>

            {openDialog && currentKey && (
              <DecryptedDataComponent
                keyInfo={currentKey}
                onClose={handleCloseDialog}
              />
            )}

            <Tooltip>
              <TooltipTrigger>
                <DeleteKeyDialog
                  keyInfo={row.original}
                  onDelete={handleDelete}
                />
              </TooltipTrigger>
              <Portal>
                <TooltipContent className="z-50 p-2 bg-white">
                  <p className="text-sm">Delete key</p>
                </TooltipContent>
              </Portal>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <ShareSymEnc data={row.original} />
              </TooltipTrigger>
              <Portal>
                <TooltipContent className="z-50 p-2 bg-white">
                  <p className="text-sm">Transform into hybrid encryption</p>
                </TooltipContent>
              </Portal>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      meta: { align: "right" },
    }),
  ];
};
