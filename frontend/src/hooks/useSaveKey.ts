import React from "react";
import { getFolderPathClientHook } from "@/hooks/getFolderPathClinet";
import { useToast } from "@/hooks/use-toast";
import { SaveSymmetricKey } from "../../wailsjs/go/keys/KeyStore";
import { LogDebug } from "../../wailsjs/runtime/runtime";

export function useSaveKey() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const saveKey = async (
    keyFileName: string,
    encryptedData: string,
    algorithmType: string,
  ) => {
    setLoading(true);
    setError(null);

    const folderPath = getFolderPathClientHook();
    if (!folderPath) {
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Uh oh! Something went wrong.",
        description: "Path to folder not found",
      });
      setLoading(false);
      return;
    }

    if (!keyFileName) {
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Uh oh! Something went wrong.",
        description: "Filename for key not provided",
      });
      setLoading(false);
      return;
    }

    if (!encryptedData) {
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Uh oh! Something went wrong.",
        description: "No encrypted data to save",
      });
      setLoading(false);
      return;
    }

    try {
      await SaveSymmetricKey(
        folderPath,
        keyFileName,
        encryptedData,
        algorithmType,
      );
      toast({
        variant: "default",
        className: "border-0",
        title: "Key Saved successfully",
      });
    } catch (error) {
      LogDebug("An error occurred when saving the key:\n");
      LogDebug(error as any);
      setError("An error occurred while saving the key");
      toast({
        variant: "destructive",
        className: "bg-red-500 border-0",
        title: "Error",
        description: "An error occurred while saving the key",
      });
    } finally {
      setLoading(false);
    }
  };

  return { saveKey, loading, errorWhenSaving: error };
}
