import { Button } from "@/components/ui/button";
import { PGPInfo } from "./keys-list";

export default function KeyMoreInfo({ keyInfo }: { keyInfo: PGPInfo }) {
  return (
    <div className="mt-5">
      <h4 className="font-bold mb-2">More Information</h4>
      <ul>
        {Object.entries(keyInfo).map(([key, value]) => (
          <li key={key} className="flex justify-start gap-2">
            <span className="font-semibold">{key}:</span>
            <span>{value}</span>
          </li>
        ))}
        <Button className="flex mt-2 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 shadow-lg transition-all">
          Export Key Pair
        </Button>
      </ul>
    </div>
  );
}
