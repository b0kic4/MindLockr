import React from "react";
import { toast } from "@/hooks/use-toast";
import { PGPInfo } from "@/lib/types/keys";
import { ClipboardIcon } from "lucide-react";

interface PGPMessageInfoProps {
  msgData: PGPInfo;
}

const handleCopy = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast({
        variant: "default",
        className: "bg-green-500 border-0",
        title: "Copied successfully",
        description: "The data has been copied to your clipboard",
      });
    })
    .catch((err) => {
      const errorMessage =
        err instanceof Error ? err.message : JSON.stringify(err);
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Failed to copy",
        description: errorMessage,
      });
    });
};

const PGPMessageInfo: React.FC<PGPMessageInfoProps> = ({ msgData }) => {
  return (
    <div className="p-4 mt-4 bg-background dark:bg-background-dark rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h4 className="font-bold mb-2">PGP Message Info</h4>
      <ul className="space-y-2">
        {Object.entries(msgData)
          .filter(([key]) => key !== "armor")
          .map(([key, value]) => (
            <li key={key} className="flex gap-2 items-start">
              <span className="font-semibold">{key}:</span>
              <span className="truncate">{JSON.stringify(value)}</span>
            </li>
          ))}
      </ul>
      {msgData.armor && (
        <div className="mt-4 bg-gray-100 dark:bg-background-dark p-2 rounded-lg overflow-auto max-h-40 relative">
          <pre className="text-sm whitespace-pre-wrap">{msgData.armor}</pre>
          <button
            className="absolute top-2 right-2 p-1 text-gray-500 hover:text-blue-500 transition-colors"
            onClick={() => handleCopy(msgData.armor)}
          >
            <ClipboardIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PGPMessageInfo;
