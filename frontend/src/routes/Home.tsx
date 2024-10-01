import { useState } from "react";
import { SelectFolder } from "../../wailsjs/go/initializeFolder/InitializeFolder.js";

export default function Home() {
  // State to hold the selected folder path
  const [folderPath, setFolderPath] = useState("");

  // Function to pick a folder and update the state
  async function pickFolder() {
    try {
      const folder = await SelectFolder();
      console.log("Folder selected: ", folder);
      setFolderPath(folder); // Update state with the selected folder
    } catch (error) {
      console.error("Error selecting folder:", error);
    }
  }

  return (
    <div className="p-4 bg-card dark:bg-card-dark text-foreground dark:text-foreground-dark shadow-md rounded-lg">
      <h1 className="text-2xl font-bold">Home Page</h1>
      <p>Welcome to the homepage!</p>

      {/* Button to trigger folder picking */}
      <button
        onClick={pickFolder}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Pick Folder
      </button>

      {/* Display the selected folder path */}
      {folderPath && (
        <div className="mt-4">
          <p className="text-lg font-semibold">Selected Folder:</p>
          <p className="text-sm text-gray-600">{folderPath}</p>
        </div>
      )}
    </div>
  );
}
