import { LogError } from "@wailsjs/runtime/runtime";

export const handleCopy = async (
  text: string,
  onCopySuccess?: () => void,
  onCopyError?: () => void,
) => {
  try {
    await navigator.clipboard.writeText(text);
    if (onCopySuccess) onCopySuccess();
  } catch (error) {
    LogError(`Failed to copy: ${error}`);
    if (onCopyError) onCopyError();
  }
};
