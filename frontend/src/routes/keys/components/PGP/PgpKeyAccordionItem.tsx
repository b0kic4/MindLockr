import React from "react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  RetrievePgpPubKey,
  RetrievePgpPrivKey,
} from "@wailsjs/go/keys/KeyRetrieve";
import { LogError } from "@wailsjs/runtime/runtime";
import { keys } from "@wailsjs/go/models";
import { usePrivateKeyDecryption } from "@/hooks/keys/usePrivateKeyDecryption";
import { DecryptButton } from "@/components/shared/decryption/DecryptButton";
import { Button } from "@/components/ui/button";
import { EyeOff } from "lucide-react";

interface PgpKeyAccordionItemProps {
  keyName: keys.PgpKeyInfo;
}

const PgpKeyAccordionItem: React.FC<PgpKeyAccordionItemProps> = ({
  keyName,
}) => {
  const [publicKey, setPublicKey] = React.useState<string>("");
  const [privateKey, setPrivateKey] = React.useState<string>("");

  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const {
    decryptedPrivKey,
    isPrivKeyVisible,
    handleDecryptPrivKey,
    handleHidePrivKey,
  } = usePrivateKeyDecryption({ keyName: keyName.name });

  React.useEffect(() => {
    if (isExpanded && !publicKey && !privateKey) {
      const fetchKeys = async () => {
        try {
          const pubKey = await RetrievePgpPubKey(keyName.name);
          const privKey = await RetrievePgpPrivKey(keyName.name);
          setPublicKey(pubKey);
          setPrivateKey(privKey);
        } catch (error) {
          LogError(`Error retrieving keys for ${keyName}: ${error}`);
        }
      };
      fetchKeys();
    }
  }, [isExpanded, keyName, publicKey, privateKey]);

  return (
    <AccordionItem value={keyName.name}>
      <AccordionTrigger onClick={handleToggle}>{keyName.name}</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold">Public Key</h4>
            <textarea
              readOnly
              value={publicKey}
              className="w-full h-32 p-3 border border-gray-600 dark:border-gray-400 bg-gray-200 dark:bg-gray-900 rounded-md"
            />
          </div>
          <div>
            <h4 className="text-lg font-semibold">Private Key</h4>
            <textarea
              readOnly
              value={decryptedPrivKey ? decryptedPrivKey : privateKey}
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
                keyName={decryptedPrivKey ? decryptedPrivKey : privateKey}
              />
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PgpKeyAccordionItem;
