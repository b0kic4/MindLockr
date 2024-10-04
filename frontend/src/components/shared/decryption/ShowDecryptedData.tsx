import { PassphraseDialog } from "@/components/shared/decryption/EnterPassphraseDialog";
import { useToast } from "@/hooks/use-toast";
import { KeyInfo } from "@/lib/types/keys";
import { decryptData } from "@/lib/utils/decryptionUtils";
import React from "react";
import { BarLoader } from "react-spinners";
import { LoadEncryptedKeyContent } from "../../../../wailsjs/go/keys/KeyRetrieve";

interface DecryptedDataProps {
  keyInfo: KeyInfo;
  onClose: () => void;
}

const DecryptedDataComponent: React.FC<DecryptedDataProps> = ({
  keyInfo,
  onClose,
}) => {
  const [decryptedData, setDecryptedData] = React.useState<string | null>(null);
  const [isPassphraseDialogOpen, setIsPassphraseDialogOpen] =
    React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleDecryptPassphraseSubmit = async (passphrase: string) => {
    if (keyInfo) {
      setIsLoading(true);
      try {
        const encryptedData = await LoadEncryptedKeyContent(
          keyInfo.name,
          keyInfo.algorithm,
        );

        const decrypted = await decryptData({
          algorithm: keyInfo.algorithm,
          encryptedData,
          passphrase,
        });

        setDecryptedData(decrypted);
        setIsPassphraseDialogOpen(false);
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
    }
  };

  const handlePassphraseDialogClose = () => {
    setIsPassphraseDialogOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 max-w-lg w-full rounded-lg shadow-lg">
        {!decryptedData && (
          <>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <BarLoader />
              </div>
            ) : (
              <PassphraseDialog
                isOpen={isPassphraseDialogOpen}
                onClose={handlePassphraseDialogClose}
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
