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

  return (
    <div className="w-full space-y-2 pt-2">
      <h2 className="text-start text-xl font-bold mb-4">Asymmetric Keys</h2>
      {keys.asymmetric.length > 0 ? (
        <Accordion type="multiple">
          {keys.asymmetric.map((folder) => (
            <AccordionItem key={folder.name} value={folder.name}>
              <AccordionTrigger className="flex justify-start items-center space-x-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                <FolderIcon className="w-5 h-5 text-blue-600" />
                <span>{folder.name}</span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="ml-6 space-y-2">
                  {folder.files.map((file) => {
                    const isAlgorithmFolder = file.name.includes("/");
                    const [algoFolder, fileName] = file.name.split("/");

                    return isAlgorithmFolder ? (
                      <li key={fileName} className="ml-4 text-lg">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <FolderIcon className="w-4 h-4" />
                          {algoFolder}
                        </div>
                        <ul className="ml-4 space-y-1">
                          <li
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
                            onClick={() =>
                              handleFileClick({
                                name: fileName,
                                type: file.type,
                                path: file.path,
                              })
                            }
                          >
                            <FileTextIcon className="w-4 h-4 text-gray-400" />
                            <span className="truncate">{fileName}</span>
                          </li>
                        </ul>
                      </li>
                    ) : (
                      <li
                        key={file.name}
                        className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
                        onClick={() =>
                          handleFileClick({
                            name: file.name,
                            type: file.type,
                            path: file.path,
                          })
                        }
                      >
                        <FileTextIcon className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{file.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-gray-500">No asymmetric keys found.</p>
      )}
    </div>
  );
}
