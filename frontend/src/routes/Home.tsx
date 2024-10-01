import { useState, useEffect } from "react";
import {
  SelectFolder,
  GetFolderPath,
} from "../../wailsjs/go/filesystem/Folder.js";

export default function Home() {
  const [folderPath, setFolderPath] = useState("");

  async function pickFolder() {
    try {
      const folder = await SelectFolder();
      console.log("Folder selected: ", folder);

      setFolderPath(folder);
    } catch (error) {
      console.error("Error selecting folder:", error);
    }
  }

  useEffect(() => {
    async function fetchFolderPath() {
      try {
        const path = await GetFolderPath();

        if (path) {
          setFolderPath(path);
        }
      } catch (error) {
        console.error("Error fetching folder path:", error);
      }
    }

    fetchFolderPath();
  }, []);

  return (
    <div className="p-4 bg-card dark:bg-card-dark text-foreground dark:text-foreground-dark shadow-md rounded-lg">
      <h1 className="text-2xl font-bold">Home Page</h1>
      <p>Welcome to the homepage!</p>

      {/* Display the selected folder path or a button to pick a folder */}
      {folderPath ? (
        <div className="mt-4">
          <p className="text-lg font-semibold">Selected Folder:</p>
          <p className="text-sm text-gray-600">{folderPath}</p>
        </div>
      ) : (
        <button
          onClick={pickFolder}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Pick Folder
        </button>
      )}
    </div>
  );
}
