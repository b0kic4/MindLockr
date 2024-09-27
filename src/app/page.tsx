"use client";

import React from "react";
import { Dashboard } from "@/components/shared/Dashboard";
import { Sidebar } from "@/components/shared/Sidebar";
import { TopNav } from "@/components/shared/TopNav";

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  const handleHamburgerClick = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <TopNav onHamburgerClick={handleHamburgerClick} />

      {/* Content container */}
      <div className="flex flex-1">
        {/* Sidebar for medium and large screens */}
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
