import { useFolderPath } from "@/hooks/folder/useFolderPath";
import { usePubPriv } from "@/hooks/keys/usePubPrivKeys";
import usePubPrivStore from "@/lib/store/usePubPrivStore";

export default function YourKeys() {
  // i need a route where the public and private keys
  // are displayed.
  // the keys are stored in the priv-pub/folderName
  // we have to list them and every key pair will have passphrase
  // we need to have the public and private keys for chatting
  // we should prompt the user to ackowlegde them (but that comes later)

  const { folderPath } = useFolderPath();
  const { privKey, setPrivKey, pubKey, setPubKey } = usePubPriv({
    folderPath: folderPath,
  });

  // RSA algorithm invlovles four steps
  //
  // key gen
  // key distribution
  // key encryption
  // key decryption

  // asymmetric alg:
  // add RSA > 2048 bits <= (4096 bits)
  // hashing:
  // add SHA-2 Family (SHA-256, SHA-384, SHA-512)
  // Use SHA-256: As a standard hash function for general purposes.
  // Use SHA-512: When higher security is required.

  // in here we are listing the pgp keys
  // and as well funcitonality for adding new
  // pgp keys

  return <div>Users Dashboard</div>;
}
