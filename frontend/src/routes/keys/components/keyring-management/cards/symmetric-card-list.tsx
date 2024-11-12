import { Card, CardContent } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { SymmetricKey } from "@/lib/types/keys";

interface SymmetricCardListProps {
  data: SymmetricKey[];
}

export function SymmetricCardList({ data }: SymmetricCardListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((item) => (
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Card
              key={item.name}
              className="shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer"
            >
              <CardContent className="flex bg-background dark:bg-background-dark justify-between items-center p-4">
                {item.name}
              </CardContent>
            </Card>
          </ContextMenuTrigger>
        </ContextMenu>
      ))}
    </div>
  );
}
