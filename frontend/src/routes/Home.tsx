import { DecryptButton } from "@/components/shared/decryption/DecryptButton.js";
import { Button } from "@/components/ui/button.js";
import { toast } from "@/hooks/use-toast.js";
import { EyeOff } from "lucide-react";
import {
  DecryptPrivKey,
  RetrievePrivKey,
  RetrievePubKey,
} from "@wailsjs/go/keys/PubPrvKeyGen.js";
import { LogError, LogInfo } from "@wailsjs/runtime/runtime.js";
import React from "react";
import {
  GetFolderPath,
  SelectFolder,
  UpdateFolderPath,
} from "../../wailsjs/go/filesystem/Folder.js";
import { PubPrivKeyGen } from "./keys/components/key-gen/PublicPrivateKeysGen.js";

export default function Home() {
  const [folderPath, setFolderPath] = React.useState("");
  const [privKey, setPrivKey] = React.useState<string>("");
  const [pubKey, setPubKey] = React.useState<string>("");
  const [decryptedPrivKey, setDecryptedPrivKey] = React.useState<string>("");
  const [isPrivKeyVisible, setIsPrivKeyVisible] =
    React.useState<boolean>(false);

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
            UpdateFolderPath(path as string);
          }
        } catch (error) {
          console.error("Error fetching folder path:", error);
        }
      }
    }
    async function getPubPrivKeys() {
      RetrievePubKey()
        .then((publicKey) => setPubKey(publicKey))
        .catch((error) => {
          LogError(error as any);
          toast({
            variant: "destructive",
            className: "bg-red-500 border-0",
            title: "Uh oh! Something went wrong.",
            description: "Error when retrieving public key",
          });
        });
      RetrievePrivKey()
        .then((privKey) => setPrivKey(privKey))
        .catch((error) => {
          LogError(error as any);
          toast({
            variant: "destructive",
            className: "bg-red-500 border-0",
            title: "Uh oh! Something went wrong.",
            description: "Error when retrieving private key",
          });
        });
    }
    initializeFolderPath();
    getPubPrivKeys();
  }, []);

  function removeFolderPath() {
    setFolderPath("");
    UpdateFolderPath("");
    localStorage.removeItem("folderPath");
  }

  const handleDecryptPrivKey = async (passphrase: string) => {
    LogInfo("Decrypting private key with passphrase...");
    try {
      const decrypted = await DecryptPrivKey(passphrase);
      setDecryptedPrivKey(decrypted);
      setIsPrivKeyVisible(true);

      setTimeout(() => {
        setDecryptedPrivKey("");
        setIsPrivKeyVisible(false);
      }, 50000); // 10000 ms = 10s
    } catch (error) {
      LogError(error as any);
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Uh oh! Something went wrong.",
        description: "Error decrypting the private key.",
      });
    }
  };

  const handleHidePrivKey = () => {
    setDecryptedPrivKey("");
    setIsPrivKeyVisible(false);
  };

  return (
    <div className="p-8 text-foreground dark:text-foreground-dark shadow-md rounded-lg flex flex-col items-center min-h-screen max-w-4xl mx-auto space-y-8">
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

      {!pubKey && !privKey && (
        <div className="w-full p-4 bg-muted dark:bg-muted-dark rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Key Generation</h2>
          <div className="text-center">
            <p className="text-md text-gray-700 dark:text-gray-300">
              Generate your Public/Private keys
            </p>
            <p className="mt-4 text-red-500 font-bold">
              Please generate Public/Private keys for this machine.
            </p>
            <PubPrivKeyGen setPrivKey={setPrivKey} setPubKey={setPubKey} />
          </div>
        </div>
      )}

      {pubKey && privKey && (
        <div className="w-full p-4 bg-muted dark:bg-muted-dark rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Generated Keys</h2>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Public Key:</h3>
            <textarea
              readOnly
              value={pubKey}
              className="w-full h-32 p-3 border border-gray-600 dark:border-gray-400 bg-gray-200 dark:bg-gray-900 rounded-md"
            />
          </div>
          <div className="relative mb-4 p-4 bg-muted dark:bg-muted-dark rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
              <h3 className="text-lg font-semibold mb-2 sm:mb-0">
                Private Key:
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <em className="text-red-500">
                  Private key is initially encrypted. Use the decryption
                  passphrase to retrieve the private key.
                </em>
              </p>
            </div>
            <textarea
              readOnly
              value={decryptedPrivKey ? decryptedPrivKey : privKey}
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-md resize-none mb-4"
              placeholder="Encrypted private key will be displayed here."
            />
            <div className="flex justify-end items-center space-x-4">
              {isPrivKeyVisible && (
                <Button onClick={handleHidePrivKey} variant="ghost">
                  <EyeOff className="w-6 h-6" />
                </Button>
              )}
              <DecryptButton
                onSubmit={handleDecryptPrivKey}
                keyName={decryptedPrivKey ? decryptedPrivKey : privKey}
              />
            </div>
          </div>
        </div>
      )}

      <div className="w-full p-4 bg-muted dark:bg-muted-dark rounded-lg shadow-md">
        <p className="text-md text-gray-700 dark:text-gray-300 text-center">
          <strong>Important:</strong> Do not share the encryption algorithm or
          passphrase. The algorithm is undetectable and stored within folders of
          files. Decryption can be slow if the algorithm is forgotten. Never
          share encryption details or passphrases with others.
        </p>
      </div>
    </div>
  );
}
