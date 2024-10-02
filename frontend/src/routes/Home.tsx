import { Button } from "@/components/ui/button.js";
import React from "react";
import {
  SelectFolder,
  GetFolderPath,
  UpdateFolderPath,
} from "../../wailsjs/go/filesystem/Folder.js";

// create folder locking?

export default function Home() {
  const [folderPath, setFolderPath] = React.useState("");

  function checkForFolderPathInLocalStorage() {
    const savedFolderPath = localStorage.getItem("folderPath");
    if (savedFolderPath) {
      setFolderPath(savedFolderPath);
      UpdateFolderPath(savedFolderPath);
      return true;
    }
    return false;
  }

  async function pickFolder() {
    try {
      const folder = await SelectFolder();
      setFolderPath(folder);
      localStorage.setItem("folderPath", folder);
      const path = localStorage.getItem("folderPath");
      if (path) {
        UpdateFolderPath(path);
      }
    } catch (error) {
      console.error("Error selecting folder:", error);
    }
  }

  React.useEffect(() => {
    async function initializeFolderPath() {
      const localStorageFound = checkForFolderPathInLocalStorage();

      if (!localStorageFound) {
        try {
          const systemPath = await GetFolderPath();
          if (systemPath) {
            setFolderPath(systemPath);
            localStorage.setItem("folderPath", systemPath);
            const path = localStorage.getItem("folderPath");
            if (path) {
              UpdateFolderPath(path);
            }
          }
        } catch (error) {
          console.error("Error fetching folder path:", error);
        }
      }
    }

    initializeFolderPath();
  }, []);

  async function changeFolderPath() {
    try {
      const folder = await SelectFolder();
      setFolderPath(folder);
      localStorage.setItem("folderPath", folder);
      const path = localStorage.getItem("folderPath");
      if (path) {
        UpdateFolderPath(path);
      }
    } catch (error) {
      console.error("Error selecting folder:", error);
    }
  }

  function removeFolderPath() {
    setFolderPath("");
    localStorage.removeItem("folderPath");
  }

  return (
    <div className="p-8 text-foreground dark:text-foreground-dark shadow-md rounded-lg flex flex-col items-center min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Welcome to your Lockr!</h1>
      </div>

      {!folderPath && (
        <div className="flex items-center justify-center my-4 p-6 rounded-md max-w-2xl text-center shadow-md">
          <p className="mt-4 text-red-500">
            Please choose a folder where you want to store encrypted data.
          </p>
        </div>
      )}

      {folderPath ? (
        <div className="flex-col justify-center items-center mt-6 text-center">
          <p className="text-lg font-semibold mb-2">Selected Folder:</p>
          <div className="flex items-center gap-4">
            <p className="text-md text-blue-600 dark:text-blue-500">
              {folderPath}
            </p>
            <Button onClick={changeFolderPath} variant="ghost">
              Change Folder Path
            </Button>
          </div>
          <div className="mt-4">
            <Button
              variant="ghost"
              onClick={removeFolderPath}
              className="text-red-500"
            >
              Remove Folder Path
            </Button>
          </div>
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
