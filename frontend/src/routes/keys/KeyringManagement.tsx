import React from "react";
import { RetrieveSymmetricKeys } from "../../../wailsjs/go/keys/KeyRetrieve";

export default function KeyringManagement() {
  const [keys, setKeys] = React.useState<string[]>([]);

  // symmetric
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Keyring Management</h2>
      {keys.length > 0 ? (
        <ul className="list-disc ml-5">
          {keys.map((key, index) => (
            <li key={index} className="mb-2">
              {key}
            </li>
          ))}
        </ul>
      ) : (
        <p>No keys found.</p>
      )}
    </div>
  );
}
