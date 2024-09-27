"use client";

import { Menu } from "lucide-react";
import { Navbar } from "./navbar";

interface TopNavProps {
  onHamburgerClick: () => void;
}

export function TopNav({ onHamburgerClick }: TopNavProps) {
  return (
    <div className="w-full h-16 bg-white shadow-md flex items-center justify-between px-4 md:px-8">
      {/* Hamburger Icon on Small Screens */}
      <div className="md:hidden">
        <button
          onClick={onHamburgerClick}
          className="text-gray-500 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <Navbar />
    </div>
  );
}
