import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

type Props = {
  encryptedData: string;
};

export default function EncryptedDataDisplay({ encryptedData }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(encryptedData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!encryptedData) return null;

  return (
    <div className="flex flex-col space-y-4 p-4 bg-muted dark:bg-muted-dark rounded-lg shadow-md">
      <h3 className="text-sm font-semibold text-foreground dark:text-foreground-dark">
        Encrypted Data
      </h3>
      <div className="relative p-4 bg-card dark:bg-card-dark rounded-lg overflow-x-auto">
        <Button
          onClick={handleCopy}
          variant={"ghost"}
          className="flex text-center items-center justify-center gap-2 absolute top-2 text-xs text-green-500 py-1  rounded transition"
        >
          {copied ? <FiCheck /> : <FiCopy />} {copied ? "Copied" : "Copy"}
        </Button>
        <p className="text-sm break-words text-foreground dark:text-foreground-dark font-mono whitespace-pre-wrap">
          {encryptedData}
        </p>
      </div>
    </div>
  );
}
