import { useFolderPath } from "@/hooks/folder/useFolderPath";
import { usePubPriv } from "@/hooks/keys/usePubPrivKeys";
import usePubPrivStore from "@/lib/store/usePubPrivStore";

export default function YourKeys() {
  const { folderPath } = useFolderPath();
  const { privKey, setPrivKey, pubKey, setPubKey } = usePubPriv({
    folderPath: folderPath,
  });

  // 1. Removing the algorithm type specification in folder paths
  // (We can determine the encryption alg by leveraging the
  // metadata embedded withing the key files and encrypted messages themselves)
  //
  // 2. RSA asymmetric encryption decryption algorithm should be implemented
  //
  // 3. Keys import export
  //
  // 4. Reorganizing the public and private pgp keys generation we should
  // have them in our PGP keys section.
  // (Currently we have only one generation of the pub and priv keys and they are displayed in home) but we should have that in seperate route and generate as much as we want and specify the usage of them

  return <div>Users Dashboard</div>;
}
