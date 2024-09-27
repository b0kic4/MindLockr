"use client";

import { Menu } from "lucide-react";
import { useSidebarStore } from "@/lib/globalState/sidebarStore";
import { Navbar } from "./navbar";
import Image from "next/image";

export function TopNav() {
  const setSidebarOpen = useSidebarStore((state) => state.setSidebarOpen);

  const handleHamburgerClick = () => {
    setSidebarOpen(true);
  };

  return (
    <div className="w-full h-16 bg-white shadow-md flex items-center relative px-4">
      {/* Hamburger Icon on the Left */}
      {/* Logo and Title */}
      <div className="hidden md:flex items-center space-x-2">
        {/* Logo */}
        <div className="w-12 h-12">
          <Image src="/128x128.png" alt="Icon" width={48} height={48} />
        </div>
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900">MindLockr</h3>
      </div>

      <div className="absolute left-4 md:hidden">
        <button
          onClick={handleHamburgerClick}
          className="text-gray-500 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Navbar Centered */}
      <div className="flex-1 flex justify-center">
        <Navbar />
      </div>
    </div>
  );
}
