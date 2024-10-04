import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Portal } from "@radix-ui/react-portal";
import { createColumnHelper } from "@tanstack/react-table";
import { KeyRound, Trash } from "lucide-react";

interface KeyInfo {
  name: string;
  algorithm: string;
  type: "Symmetric" | "Asymmetric";
}

export const getKeyColumns = (
  handleDelete: (key: KeyInfo) => void,
  handleDecrypt: (key: KeyInfo) => void,
) => {
  const columnHelper = createColumnHelper<KeyInfo>();

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
        <div className="flex space-x-4">
          {/* Action buttons */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleDecrypt(row.original)}
                  aria-label={`Decrypt key ${row.original.name}`}
                >
                  <KeyRound className="w-5 h-5 text-primary hover:text-primary-dark" />
                </button>
              </TooltipTrigger>
              <Portal>
                <TooltipContent className="z-50 p-2 bg-white ">
                  <p className="text-sm">Decrypt</p>
                </TooltipContent>
              </Portal>
            </Tooltip>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button aria-label={`Delete key ${row.original.name}`}>
                  <Trash className="w-5 h-5 text-red-500" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your encrypted file and remove its data from your
                    filesystem.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-0">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(row.original)}
                    aria-label={`Delete key ${row.original.name}`}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TooltipProvider>
        </div>
      ),
      meta: { align: "right" },
    }),
  ];
};
