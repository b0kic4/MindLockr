import React from "react";
import {
  GetFolderPath,
  SelectFolder,
  UpdateFolderPath,
} from "@wailsjs/go/filesystem/Folder";

export function useFolderPath() {
  const [folderPath, setFolderPath] = React.useState<string>("");

  // Check for saved path in localStorage
  function checkForFolderPathInLocalStorage() {
    const savedFolderPath = localStorage.getItem("folderPath");
    if (savedFolderPath) {
      setFolderPath(savedFolderPath);
      UpdateFolderPath(savedFolderPath);
      return true;
    }
    return false;
  }

  // Function to select a folder
  async function pickFolder() {
    try {
      const folder = await SelectFolder();
      setFolderPath(folder);
      localStorage.setItem("folderPath", folder);
      UpdateFolderPath(folder);
    } catch (error) {
      console.error("Error selecting folder:", error);
    }
  }

  // Function to remove the folder path
  function removeFolderPath() {
    setFolderPath("");
    UpdateFolderPath("");
    localStorage.removeItem("folderPath");
  }

  // Initialize folder path on component mount
  React.useEffect(() => {
    async function initializeFolderPath() {
      const localStorageFound = checkForFolderPathInLocalStorage();
      if (!localStorageFound) {
        try {
          const systemPath = await GetFolderPath();
          if (systemPath) {
            setFolderPath(systemPath);
            localStorage.setItem("folderPath", systemPath);
            UpdateFolderPath(systemPath);
          }
        } catch (error) {
          console.error("Error fetching folder path:", error);
        }
      }
    }
    initializeFolderPath();
  }, []);

  return { folderPath, pickFolder, removeFolderPath };
}
