type Props = {
  encryptedData: string;
};

export default function EncryptedDataDisplay({ encryptedData }: Props) {
  if (!encryptedData) return null;

  return (
    <div className="flex flex-col space-y-4 p-4 bg-muted dark:bg-muted-dark rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-foreground dark:text-foreground-dark">
        Encrypted Data
      </h3>
      <div className="p-3 bg-card dark:bg-card-dark rounded-lg overflow-x-auto">
        <p className="text-sm break-words text-foreground dark:text-foreground-dark">
          {encryptedData}
        </p>
      </div>
    </div>
  );
}
