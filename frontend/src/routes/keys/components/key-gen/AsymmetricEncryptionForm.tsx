import React from "react";
import { Input } from "@/components/ui/input";
import { LogInfo } from "@wailsjs/runtime/runtime";
import usePubPrivStore from "@/lib/store/usePubPrivStore";

interface Props {
  passphrase: string;
}

export default function AsymmetricKeyEncryptionForm({ passphrase }: Props) {
  const { setPrivKey, setPubKey, clearKeys, privKey, pubKey } =
    usePubPrivStore();

  const useMyPrivateKey = () => {};

  const useMyPublicKey = () => {};

  return (
    <div className="space-y-4 p-4 bg-muted dark:bg-muted-dark mt-4 rounded-lg">
      <h3 className="text-lg font-semibold">Asymmetric Key Encryption</h3>
      <p className="text-sm text-foreground dark:text-foreground-dark">
        Please provide the recipient public and your private keys to use with
        the asymmetric encryption.
      </p>

      <div className="space-y-2">
        <label
          htmlFor="publicKey"
          className="block text-sm font-medium text-foreground dark:text-foreground-dark"
        >
          Public Key
        </label>
        <Input id="publicKey" placeholder="Enter Public Key" />

        <label
          htmlFor="privateKey"
          className="block text-sm font-medium text-foreground dark:text-foreground-dark"
        >
          Private Key
        </label>
        <Input id="privateKey" placeholder="Enter Private Key" />
      </div>
    </div>
  );
}
