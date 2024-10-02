import React from "react";
import { RetrieveSymmetricKeys } from "../../../wailsjs/go/keys/KeyRetrieve";
import { AES128Decryption } from "../../../wailsjs/go/decryption/Cryptography.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";

export default function KeyringManagement() {
  const [keys, setKeys] = React.useState<string[]>([]);

  const fetchKeys = async () => {
    try {
      const retrievedKeys = await RetrieveSymmetricKeys();
      setKeys(retrievedKeys);
    } catch (error) {
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((key, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-start">{key}</TableCell>
                <TableCell>
                  <div className="flex space-x-4">
                    <button onClick={() => handleEdit(key)}>
                      <Pencil className="w-5 h-5 text-blue-500 hover:text-blue-700" />
                    </button>
                    <button onClick={() => handleDelete(key)}>
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
