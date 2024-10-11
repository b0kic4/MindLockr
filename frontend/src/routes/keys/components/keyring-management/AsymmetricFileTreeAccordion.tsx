import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FolderIcon, FileTextIcon } from "lucide-react";
import { useKeys } from "@/hooks/keys/useKeys";
import { LogInfo } from "@wailsjs/runtime/runtime";

export function FileTreeAccordion() {
  const { keys } = useKeys();

  return (
    <div className="w-1/3 space-y-2 pt-2">
      <h2 className="text-start text-xl font-bold">Asymmetric Keys</h2>
      {keys.asymmetric.length > 0 ? (
        <Accordion type="multiple">
          {keys.asymmetric.map((folder) => (
            <AccordionItem key={folder.name} value={folder.name}>
              <AccordionTrigger className="flex justify-start space-x-4">
                <FolderIcon className="w-4 h-4 text-gray-600" />
                <span>{folder.name}</span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="ml-6 space-y-2 text-sm">
                  {folder.files.map((file) => {
                    const isAlgorithmFolder = file.name.includes("/");
                    const [algoFolder, fileName] = file.name.split("/");

                    LogInfo(JSON.stringify(keys.asymmetric));

                    return isAlgorithmFolder ? (
                      <li key={fileName} className="ml-4">
                        <span className="flex gap-2 items-center text-center font-semibold">
                          <FolderIcon className="w-4 h-4 text-gray-600" />
                          {algoFolder}
                        </span>
                        <ul className="ml-4 space-y-1">
                          <li className="flex items-center space-x-2">
                            <FileTextIcon className="w-4 h-4 text-gray-400" />
                            <span>{fileName}</span>
                          </li>
                        </ul>
                      </li>
                    ) : (
                      <li
                        key={file.name}
                        className="flex items-center space-x-2 py-1"
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
