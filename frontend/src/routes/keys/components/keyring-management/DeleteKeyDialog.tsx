import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { KeyInfo } from "@/lib/types/keys";
import { Trash } from "lucide-react";

interface DeleteKeyDialogProps {
  keyInfo: KeyInfo;
  onDelete: (key: KeyInfo) => void;
}

const DeleteKeyDialog: React.FC<DeleteKeyDialogProps> = ({
  keyInfo,
  onDelete,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button aria-label={`Delete key ${keyInfo.name}`}>
          <Trash className="w-5 h-5 text-red-500" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            encrypted file and remove its data from your filesystem.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-0">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(keyInfo)}
            aria-label={`Delete key ${keyInfo.name}`}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteKeyDialog;
