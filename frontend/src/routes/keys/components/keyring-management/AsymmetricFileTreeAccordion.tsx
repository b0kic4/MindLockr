import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FolderIcon, FileTextIcon } from "lucide-react";

// Define types for the data structure
interface File {
  name: string;
  type: string;
}

interface Folder {
  name: string;
  files: File[];
}

async function fetchAsymmetricFolders(): Promise<Folder[]> {
  return [
    {
      name: "Folder1",
      files: [
        { name: "encryption.key", type: "Key File" },
        { name: "data.enc", type: "Encrypted Data" },
        { name: "signature.sig", type: "Signature" },
      ],
    },
    {
      name: "Folder2",
      files: [
        { name: "encryption.key", type: "Key File" },
        { name: "data.enc", type: "Encrypted Data" },
        { name: "signature.sig", type: "Signature" },
      ],
    },
  ];
}

// here needs to be form next to the files
// based on the extension for the file
// (decryption of passphrase, symmetric decryption, validation)

export function FileTreeAccordion() {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAsymmetricFolders();
      setFolders(data);
    };

    fetchData();
  }, []);

  return (
    <Accordion type="multiple" className="w-fit">
      {folders.map((folder: Folder) => (
        <AccordionItem key={folder.name} value={folder.name}>
          <AccordionTrigger className="flex items-center space-x-2">
            <FolderIcon className="w-4 h-4 text-gray-600" />
            <span>{folder.name}</span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="ml-6">
              {folder.files.map((file: File) => (
                <li
                  key={file.name}
                  className="flex items-center space-x-2 py-1"
                >
                  <FileTextIcon className="w-4 h-4 text-gray-400" />
                  <span>{file.name}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
