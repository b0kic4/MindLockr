import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function Questions() {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };
  return (
    <div>
      <div className="flex items-center justify-center">
        <Button variant="ghost" onClick={toggleVisibility}>
          {isVisible ? (
            <>
              Hide Questions <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Show Questions <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {isVisible && (
        <Accordion type="single" collapsible className="w-full mt-4">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-medium text-gray-800 dark:text-gray-200">
              How to use this tool?
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <p className="mb-4 text-foreground dark:text-foreground-dark">
                This tool helps you encrypt data using either symmetric or
                asymmetric encryption methods. Choose the right encryption type
                based on your needs.
              </p>

              <Accordion
                type="single"
                collapsible
                className="nested-accordion space-y-2"
              >
                <AccordionItem value="item-1-1">
                  <AccordionTrigger className="text-base font-semibold text-red-500 hover:underline">
                    What encryption type should I choose?
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <p className="text-sm text-foreground dark:text-foreground-dark">
                      The encryption type you choose depends on your use case.
                      You can use either symmetric encryption for personal data
                      storage or asymmetric encryption for sharing data securely
                      with others.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-medium text-gray-800 dark:text-gray-200">
              When should I use symmetric encryption?
            </AccordionTrigger>
            <AccordionContent className="pl-4 text-foreground dark:text-foreground-dark">
              <p className="mb-4 text-foreground dark:text-foreground-dark">
                Symmetric encryption is best when you're storing or encrypting
                your own data, and you don’t need to share it with others.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-medium text-gray-800 dark:text-gray-200">
              When should I use asymmetric encryption?
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <p className="mb-4 text-foreground dark:text-foreground-dark">
                Asymmetric encryption is useful for secure data sharing with
                others because you can safely share your public key while
                keeping your private key secret.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-medium text-gray-800 dark:text-gray-200">
              How do I generate a PGP Public/Private key pair?
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <p className="mb-4 text-foreground dark:text-foreground-dark">
                You can generate a key pair by selecting the encryption
                algorithm (like RSA or ECC) and clicking "Generate" on PGP Keys
                section.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-foreground dark:text-foreground-dark">
                <li>Select the encryption type (RSA or ECC).</li>
                <li>Choose the key size (e.g., 2048 or 4096 bits).</li>
                <li>Click "Generate" to create the key pair.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
