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
          setFolderPath(path); // Set the folder path in the state
        }
      } catch (error) {
        console.error("Error fetching folder path:", error);
      }
    }
    fetchFolderPath();
  }, []);

  return (
    <div className="p-8 text-foreground dark:text-foreground-dark shadow-md rounded-lg flex flex-col items-center min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Welcome to your Lockr!</h1>
      </div>

      {/* Explanation Section */}
      <div className="my-4 p-6 bg-gray-100 dark:bg-gray-800 rounded-md max-w-2xl text-center shadow-md">
        <p className="text-gray-700 dark:text-gray-300">
          By default, MindLockr does not have access to your file system. Every
          time you run this application, you need to locate the folder where you
          want to encrypt and store your data. If you'd like, we can create a
          folder for you, or you can use a default file path based on your
          operating system to store the config file, which will remember the
          folder where your data is stored.
        </p>
      </div>

      {/* Folder Path or Button to Select Folder */}
      {folderPath ? (
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold mb-2">Selected Folder:</p>
          <p className="text-md text-blue-600 dark:text-blue-500">
            {folderPath}
          </p>
        </div>
      ) : (
        <button
          onClick={pickFolder}
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 shadow-lg transition-all"
        >
          Pick Folder
        </button>
      )}
    </div>
  );
}
