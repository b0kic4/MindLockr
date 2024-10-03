import React from "react";
import { Pencil, Trash } from "lucide-react";
import { Portal } from "@radix-ui/react-select";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface KeyActionButtonsProps {
  keyName: string;
  onEdit: (key: string) => void;
  onDelete: (key: string) => void;
}

export const KeyActionButtons: React.FC<KeyActionButtonsProps> = ({
  keyName,
  onEdit,
  onDelete,
}) => (
  <div className="flex justify-end space-x-4">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => onEdit(keyName)}
            aria-label={`Edit key ${keyName}`}
          >
            <Pencil className="w-5 h-5 text-primary hover:text-primary-dark" />
          </button>
        </TooltipTrigger>
        <Portal>
          <TooltipContent
            side="top"
            align="center"
            className="bg-card text-foreground border border-border rounded shadow-md px-2 py-1 z-50"
          >
            <p className="text-sm">Edit</p>
          </TooltipContent>
        </Portal>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => onDelete(keyName)}
            aria-label={`Delete key ${keyName}`}
          >
            <Trash className="w-5 h-5 text-secondary hover:text-secondary-dark" />
          </button>
        </TooltipTrigger>
        <Portal>
          <TooltipContent
            side="top"
            align="center"
            className="bg-card text-foreground border border-border rounded shadow-md px-2 py-1 z-50"
          >
            <p className="text-sm">Delete</p>
          </TooltipContent>
        </Portal>
      </Tooltip>
    </TooltipProvider>
  </div>
);
