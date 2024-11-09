import { PGPInfo } from "./keys-list";

export default function KeyMoreInfo({ keyInfo }: { keyInfo: PGPInfo }) {
  return (
    <div className="mt-5 text-sm">
      <h4 className="font-bold mb-2">More Information</h4>
      <ul>
        {Object.entries(keyInfo).map(([key, value]) => (
          <li key={key} className="flex justify-start gap-2">
            <span className="font-semibold">{key}:</span>
            <span>{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
