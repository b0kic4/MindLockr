import React from "react";
import {
  RetrieveSymmetricKeys,
  RetrieveAsymmetricKeys,
} from "../../../wailsjs/go/keys/KeyRetrieve"; // Import key retrieval
import { LogInfo, LogPrint, LogError } from "../../../wailsjs/runtime/runtime";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";

interface KeyInfo {
  name: string;
  algorithm: string;
}

export default function KeyringManagement() {
  const [keys, setKeys] = React.useState<KeyInfo[]>([]);

  const fetchKeys = async () => {
    try {
      // Fetch symmetric and asymmetric keys
      const symmetricKeys: KeyInfo[] = await RetrieveSymmetricKeys();
      const asymmetricKeys: KeyInfo[] = await RetrieveAsymmetricKeys();

      // Combine symmetric and asymmetric keys into one array
      const allKeys = [
        ...symmetricKeys.map((key) => ({
          name: key.name,
          type: "Symmetric",
          algorithm: key.algorithm,
        })),
        ...asymmetricKeys.map((key) => ({
          name: key.name,
          type: "Asymmetric",
          algorithm: key.algorithm,
        })),
      ];
      LogPrint("Kurcina");
      LogPrint(JSON.stringify(allKeys, null, 2));

      setKeys(allKeys);
    } catch (error) {
      LogError(error as any);
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Keyring Management</h2>
      {keys.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Algorithm</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((key, index) => (
              <TableRow key={index}>
                <TableCell>{key.name}</TableCell>
                <TableCell>{key.algorithm}</TableCell>
                <TableCell>
                  <div className="flex space-x-4">
                    <button onClick={() => handleEdit(key.name)}>
                      <Pencil className="w-5 h-5 text-blue-500 hover:text-blue-700" />
                    </button>
                    <button onClick={() => handleDelete(key.name)}>
                      <Trash className="w-5 h-5 text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No keys found.</p>
      )}
    </div>
  );
}
