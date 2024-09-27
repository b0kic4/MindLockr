import { TopNav } from "@/components/shared/navbar/TopNav";
import { Sidebar } from "@/components/shared/sidebar/Sidebar";

export default function RoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
