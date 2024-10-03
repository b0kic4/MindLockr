import { createColumnHelper } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Portal } from "@radix-ui/react-portal";

interface KeyInfo {
  name: string;
  algorithm: string;
  type: "Symmetric" | "Asymmetric";
}

export const getKeyColumns = (
  handleEdit: (key: string) => void,
  handleDelete: (key: string) => void,
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
                  onClick={() => handleEdit(row.original.name)}
                  aria-label={`Edit key ${row.original.name}`}
                >
                  <Pencil className="w-5 h-5 text-primary hover:text-primary-dark" />
                </button>
              </TooltipTrigger>
              <Portal>
                <TooltipContent className="z-50 p-2 bg-white ">
                  <p className="text-sm">Edit</p>
                </TooltipContent>
              </Portal>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleDelete(row.original.name)}
                  aria-label={`Delete key ${row.original.name}`}
                >
                  <Trash className="w-5 h-5 text-secondary hover:text-secondary-dark" />
                </button>
              </TooltipTrigger>
              <Portal>
                <TooltipContent className="z-50 p-2 bg-white ">
                  <p className="text-sm">Delete</p>
                </TooltipContent>
              </Portal>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      meta: { align: "right" }, // Add alignment
    }),
  ];
};
