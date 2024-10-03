import React from "react";
import {
  RetrieveSymmetricKeys,
  RetrieveAsymmetricKeys,
} from "../../../wailsjs/go/keys/KeyRetrieve";
import {
  LogWarning,
  LogPrint,
  LogError,
} from "../../../wailsjs/runtime/runtime";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export default function KeyringManagement() {
  const [keys, setKeys] = React.useState<KeyInfo[]>([]);

  const fetchKeys = async () => {
    try {
      const [symmetricKeys, asymmetricKeys] = await Promise.all([
        RetrieveSymmetricKeys().catch((error) => {
          LogWarning("No symmetric keys found or error occurred: " + error);
          return [];
        }),
        RetrieveAsymmetricKeys().catch((error) => {
          LogWarning("No asymmetric keys found or error occurred: " + error);
          return [];
        }),
      ]);

      LogPrint("Keys retrieved successfully.");

      const allKeys = [
        ...symmetricKeys.map((key) => ({
          name: key.name,
          algorithm: key.algorithm,
          type: "Symmetric" as const,
        })),
        ...asymmetricKeys.map((key) => ({
          name: key.name,
          algorithm: key.algorithm,
          type: "Asymmetric" as const,
        })),
      ];

      setKeys(allKeys);
    } catch (error) {
      LogError("Error retrieving keys: " + error);
      console.error("Error retrieving keys:", error);
    }
  };

  React.useEffect(() => {
    fetchKeys();
  }, []);

  const handleEdit = (key: string) => {
    console.log("Edit key:", key);
  };

  const handleDelete = (key: string) => {
    console.log("Delete key:", key);
  };

  return (
    <div className="p-6 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
      <h2 className="text-2xl font-bold mb-4">Keyring Management</h2>
      {keys.length > 0 ? (
        <div className="overflow-x-auto">
          <Table className="min-w-full divide-y divide-border">
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Key Name
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Algorithm
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Key Type
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {keys.map((key, index) => (
                <TableRow key={index}>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-left text-sm">
                    {key.name}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-left text-sm">
                    {key.algorithm}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-left text-sm">
                    {key.type}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleEdit(key.name)}
                              aria-label={`Edit key ${key.name}`}
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
                              onClick={() => handleDelete(key.name)}
                              aria-label={`Delete key ${key.name}`}
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
