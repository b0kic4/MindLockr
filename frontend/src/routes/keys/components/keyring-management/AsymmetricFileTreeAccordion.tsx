import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useKeys } from "@/hooks/keys/useKeys";
import useSelectedAsymmetricFileStore from "@/lib/store/useSelectAsymmetricFile";
import { FileTextIcon, FolderIcon } from "lucide-react";

export function FileTreeAccordion() {
  const { keys } = useKeys();
  const setSelectedFile = useSelectedAsymmetricFileStore(
    (state) => state.setSelectedFile,
  );

  const handleFileClick = (file: {
    name: string;
    type: string;
    path: string;
  }) => {
    setSelectedFile(file);
  };

  // TODO:
  // signature:
  // 1. provide the signature file
  // 2. provide senders public key to validate the authority

  return (
    <div className="w-1/3 space-y-2 pt-2">
      <h2 className="text-start text-xl font-bold">Asymmetric Keys</h2>
      {keys.asymmetric.length > 0 ? (
        <Accordion type="multiple">
          {keys.asymmetric.map((folder) => (
            <AccordionItem key={folder.name} value={folder.name}>
              <AccordionTrigger className="flex justify-start space-x-4 text-lg">
                <FolderIcon className="w-4 h-4 text-gray-600" />
                <span>{folder.name}</span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="ml-6 space-y-2">
                  {folder.files.map((file) => {
                    const isAlgorithmFolder = file.name.includes("/");
                    const [algoFolder, fileName] = file.name.split("/");

                    return isAlgorithmFolder ? (
                      <li key={fileName} className="ml-4 text-lg">
                        <span className="flex gap-2 items-center text-center text-lg font-semibold">
                          <FolderIcon className="w-4 h-4 text-gray-600" />
                          {algoFolder}
                        </span>
                        <ul className="ml-4 space-y-1">
                          <li
                            className="flex text-lg items-center space-x-2 cursor-pointer"
                            onClick={() =>
                              handleFileClick({
                                name: fileName,
                                type: file.type,
                                path: file.path,
                              })
                            }
                          >
                            <FileTextIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-lg">{fileName}</span>
                          </li>
                        </ul>
                      </li>
                    ) : (
                      <li
                        key={file.name}
                        className="flex text-lg items-center space-x-2 py-1 cursor-pointer"
                        onClick={() =>
                          handleFileClick({
                            name: file.name,
                            type: file.type,
                            path: file.path,
                          })
                        }
                      >
                        <FileTextIcon className="w-4 h-4 text-gray-400" />
                        <span>{file.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p>No asymmetric keys found.</p>
      )}
    </div>
  );
}
