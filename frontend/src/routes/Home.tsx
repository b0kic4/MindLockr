import { DecryptButton } from "@/components/shared/decryption/DecryptButton.js";
import { Button } from "@/components/ui/button.js";
import { useFolderPath } from "@/hooks/folder/useFolderPath.js";
import { usePrivateKeyDecryption } from "@/hooks/keys/usePrivateKeyDecryption.js";
import { useMsgPGP } from "@/hooks/keys/useMsgPGP.js";
import { EyeOff } from "lucide-react";
import { MsgPGPGenForm } from "./keys/components/key-gen/MessagingPgpKeysGenForm.js";

export default function Home() {
  // hooks
  const { folderPath, pickFolder, removeFolderPath } = useFolderPath();
  const { privKey, setPrivKey, pubKey, setPubKey } = useMsgPGP({
    folderPath: folderPath,
  });

  const {
    decryptedPrivKey,
    isPrivKeyVisible,
    handleDecryptPrivKey,
    handleHidePrivKey,
  } = usePrivateKeyDecryption({ keyName: "msg" });

  // when the user clicks on
  // generate keys (pub and priv keys)
  // are generated,
  // and those keys can be used for whatever
  //
  // but when generating the pub and priv keys
  // we would need to specify the folder for those keys
  // for the user to know for what is it used for

  // I should add the generate keys
  // for sharing the messages between machines
  // for the chatting application
  //
  // also those keys needs to re-generated
  // every time the user wants to change the keys
  // maybe I should have the linked list that
  // old public key will point to the new one
  // I should add setting usernames

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

      {!pubKey && !privKey && (
        <div className="w-full p-4 bg-muted dark:bg-muted-dark rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            Messages Key Generation
          </h2>
          <div className="text-center">
            <p className="text-md text-gray-700 dark:text-gray-300">
              Generate your Public/Private Messaging keys
            </p>
            <p className="mt-4 text-red-500 font-bold">
              Please generate Public/Private keys for this machine.
              <br /> Those keys will be used for the Message exchanging
            </p>
            <MsgPGPGenForm setPrivKey={setPrivKey} setPubKey={setPubKey} />
          </div>
        </div>
      )}

      {pubKey && privKey && (
        <div className="w-full p-4 bg-muted dark:bg-muted-dark rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            Generated Messaging Keys
          </h2>
          <div className="mb-4">
            <h3 className="text-start px-4 text-lg font-semibold">
              PGP Public Key:
            </h3>
            <textarea
              readOnly
              value={pubKey}
              className="w-full h-32 p-3 border border-gray-600 dark:border-gray-400 bg-gray-200 dark:bg-gray-900 rounded-md"
            />
          </div>
          <div className="relative mb-4 p-4 bg-muted dark:bg-muted-dark rounded-lg shadow-md">
            <div className="flex flex-col gap-2 sm:flex-row items-start sm:items-center justify-between mb-2">
              <h3 className="text-lg font-semibold mb-2 sm:mb-0 text-nowrap">
                PGP Private Key:
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <em className="text-red-500 text-nowrap">
                  Private key is initially encrypted. Use the decryption
                  passphrase to retrieve the pgp key.
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
