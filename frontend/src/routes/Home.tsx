import { Button } from "@/components/ui/button.js";
import { useFolderPath } from "@/hooks/folder/useFolderPath.js";

export default function Home() {
  // hooks
  const { folderPath, pickFolder, removeFolderPath } = useFolderPath();

  return (
    <div className="p-8 text-foreground dark:text-foreground-dark shadow-md rounded-lg flex flex-col items-center min-h-screen max-w-4xl mx-auto mt-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to your Lockr!</h1>
        <p className="text-md text-gray-600 dark:text-gray-400">
          Secure your files, safeguard your privacy.
        </p>
      </div>

      <div className="w-full p-4 bg-muted dark:bg-muted-dark rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-2">Folder Path Selection</h2>
        {folderPath ? (
          <div className="flex flex-col items-center">
            <p className="text-lg mb-2">Selected Folder:</p>
            <div className="flex items-center justify-center gap-4">
              <p className="text-md text-blue-600 dark:text-blue-500 truncate">
                {folderPath}
              </p>
              <Button onClick={pickFolder} variant="ghost">
                Change Folder Path
              </Button>
            </div>
            <Button
              onClick={removeFolderPath}
              className="mt-4 text-red-500"
              variant="ghost"
            >
              Remove Folder Path
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Button
              onClick={pickFolder}
              className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 shadow-lg transition-all"
            >
              Pick Folder
            </Button>
            <p className="mt-4 text-red-500">
              Please choose a folder to store encrypted data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
