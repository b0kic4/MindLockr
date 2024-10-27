import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  keyType: string;
  setKeyType: (value: string) => void;
  children: React.ReactNode;
};

export default function KeyTypeTabs({ keyType, setKeyType, children }: Props) {
  return (
    <Tabs
      defaultValue="symmetric"
      onValueChange={setKeyType}
      className="w-full mt-6"
    >
      <TabsList className="mb-4 bg-muted dark:bg-muted-dark">
        <TabsTrigger value="symmetric">Symmetric Encryption</TabsTrigger>
        <TabsTrigger value="asymmetric">Hybrid Encryption</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}
