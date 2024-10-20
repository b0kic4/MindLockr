import { PassphraseDialog } from "@/components/shared/decryption/PassphraseDialog";
import { useToast } from "@/hooks/use-toast";
import { KeyInfo } from "@/lib/types/keys";
import React from "react";
import { PacmanLoader } from "react-spinners";
import { LoadEncryptedKeyContent } from "@wailsjs/go/keys/KeyRetrieve";
import { DecryptAES } from "@wailsjs/go/symmetricdecryption/Cryptography";

interface DecryptedDataProps {
  keyInfo: KeyInfo;
  onClose: () => void;
}

type DataToDecrypt = {
  encryptedData: string;
  passphrase: string;
};

const DecryptedDataComponent: React.FC<DecryptedDataProps> = ({
  keyInfo,
  onClose,
}) => {
  const [decryptedData, setDecryptedData] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  // need to handle the onClose state

  const handleDecryptPassphraseSubmit = async (passphrase: string) => {
    setIsLoading(true);
    try {
      const encryptedData = await LoadEncryptedKeyContent(
        keyInfo.name,
        keyInfo.algorithm,
      );

      const dataToDecrypt: DataToDecrypt = {
        encryptedData: encryptedData,
        passphrase: passphrase,
      };

      const decrypted = await DecryptAES(
        keyInfo.algorithm as any,
        dataToDecrypt,
      );

      setDecryptedData(decrypted);
    } catch (error) {
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Decryption failed",
        description: "An error occurred during decryption.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 max-w-lg w-full rounded-lg shadow-lg">
        {!decryptedData && (
          <>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <PacmanLoader size={8} color="#fff" />
              </div>
            ) : (
              <PassphraseDialog
                onClose={onClose}
                onSubmit={handleDecryptPassphraseSubmit}
                keyName={keyInfo.name}
              />
            )}
          </>
        )}
        {decryptedData && (
          <div className="mt-6 p-4 bg-background dark:bg-background-dark rounded-lg">
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground-dark mb-2">
              Decrypted Data
            </h3>
            <pre className="whitespace-pre-wrap text-gray-700 bg-gray-100 p-2 rounded-lg mb-4">
              {decryptedData}
            </pre>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecryptedDataComponent;
