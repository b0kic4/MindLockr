interface Props {
  algorithmType: string;
}
export default function AlgorithmTypeDescription({ algorithmType }: Props) {
  return <div>{getDescription(algorithmType)}</div>;
}

const getDescription = (type: string) => {
  switch (type) {
    case "AES-128":
      return <AES128Text />;
    case "AES-192":
      return <AES192Text />;
    case "AES-256":
      return <AES256Text />;
    default:
      return null;
  }
};

export const AES128Text = () => (
  <p className="text-sm text-foreground dark:text-foreground-dark mt-2">
    AES-128 uses a 128-bit (16-byte) key for encryption, meaning the passphrase
    should be at least 16 characters long. If the passphrase exceeds 16
    characters, it will be truncated. Passphrases shorter than 16 characters
    will be salted to reach the required length.
  </p>
);

export const AES192Text = () => (
  <p className="text-sm text-foreground dark:text-foreground-dark mt-2">
    AES-192 uses a 192-bit (24-byte) key for encryption, meaning the passphrase
    should be at least 24 characters long. If the passphrase exceeds 24
    characters, it will be truncated. Passphrases shorter than 24 characters
    will be salted to reach the required length.
  </p>
);

export const AES256Text = () => (
  <p className="text-sm text-foreground dark:text-foreground-dark mt-2">
    AES-256 uses a 256-bit (32-byte) key for encryption, meaning the passphrase
    should be at least 32 characters long (1 character = 1 byte). If the
    passphrase is longer than 32 characters, it will be truncated to fit.
    Passphrases shorter than 32 characters will be salted to reach the required
    length.
  </p>
);
