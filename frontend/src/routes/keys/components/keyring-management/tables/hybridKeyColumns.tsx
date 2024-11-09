import {
  Portal,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { ColumnDef } from "@tanstack/react-table";
import { en } from "@wailsjs/go/models";
import { KeyRound, Search, Trash } from "lucide-react";

export const getHybridKeyColumns = (
  handleDelete: (file: any) => void,
): ColumnDef<en.FileInfo, any>[] => {
  const handleVerify = (file: en.FileInfo) => {};

  const handleDecrypt = (file: en.FileInfo) => {};

  return [
    {
      accessorKey: "name",
      header: "Data Name",
      cell: ({ row }) => row.original.name,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <button
                  aria-label="Decrypt"
                  onClick={() => handleDecrypt(row.original as any)}
                >
                  <KeyRound className="w-5 h-5 text-green-500 hover:text-green-500" />
                </button>
              </TooltipTrigger>
              <Portal>
                <TooltipContent className="z-50 p-2 bg-white">
                  <p className="text-sm">Decrypt with recievers private key</p>
                </TooltipContent>
              </Portal>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <button
                  aria-label="Verify"
                  onClick={() => handleVerify(row.original as any)}
                >
                  <Search className="w-5 h-5 text-blue-500 hover:text-blue-500" />
                </button>
              </TooltipTrigger>
              <Portal>
                <TooltipContent className="z-50 p-2 bg-white">
                  <p className="text-sm">Verify Signature</p>
                </TooltipContent>
              </Portal>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <button
                  aria-label="Delete"
                  onClick={() => handleDelete(row.original as any)}
                >
                  <Trash className="w-5 h-5 text-red-500 hover:text-red-500" />
                </button>
              </TooltipTrigger>
              <Portal>
                <TooltipContent className="z-50 p-2 bg-white">
                  <p className="text-sm">Delete</p>
                </TooltipContent>
              </Portal>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];
};
