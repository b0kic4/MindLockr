import React from "react";
import { Dashboard } from "@/components/shared/Dashboard";
import { Sidebar } from "@/components/shared/sidebar/Sidebar";
import { TopNav } from "@/components/shared/navbar/TopNav";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
