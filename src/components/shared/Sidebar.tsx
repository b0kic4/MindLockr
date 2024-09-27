"use client";

import { Home, Calendar, Settings, HelpCircle, X } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen w-52 bg-white shadow-lg p-4 flex flex-col items-start z-20 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`} // Mobile sidebar only
      >
        {/* Close Icon */}
        <div className="flex justify-end w-full">
          <button
            onClick={onClose}
            className="text-gray-500 focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Logo */}
        <div className="bg-transparent w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mt-2">
          <img src="/128x128.png" alt="Icon" />
        </div>

        {/* Nav Icons */}
        <nav className="flex flex-col space-y-4 mt-8 w-full">
          <Link
            href="/"
            className="flex items-center space-x-2 px-2 hover:text-purple-500"
          >
            <Home className="w-6 h-6" />
            <span>Home</span>
          </Link>
          <Link
            href="/calendar"
            className="flex items-center space-x-2 px-2 hover:text-purple-500"
          >
            <Calendar className="w-6 h-6" />
            <span>Calendar</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center space-x-2 px-2 hover:text-purple-500"
          >
            <Settings className="w-6 h-6" />
            <span>Settings</span>
          </Link>
          <Link
            href="/help"
            className="flex items-center space-x-2 px-2 hover:text-purple-500"
          >
            <HelpCircle className="w-6 h-6" />
            <span>Help</span>
          </Link>
        </nav>
      </aside>

      {/* Sidebar for medium and larger screens */}
      <aside className="hidden md:flex md:flex-col md:w-20 lg:w-52 md:h-screen md:bg-white md:shadow-lg md:p-4 md:items-start md:flex-shrink-0">
        {/* Logo */}
        <div className="bg-transparent w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl">
          <img src="/128x128.png" alt="Icon" />
        </div>

        {/* Nav Icons */}
        <nav className="flex flex-col space-y-4 mt-8 w-full">
          <Link
            href="/"
            className="flex items-center justify-center lg:justify-start space-x-2 px-2 hover:text-purple-500"
          >
            <Home className="w-6 h-6" />
            <span className="hidden lg:block">Home</span>
          </Link>
          <Link
            href="/calendar"
            className="flex items-center justify-center lg:justify-start space-x-2 px-2 hover:text-purple-500"
          >
            <Calendar className="w-6 h-6" />
            <span className="hidden lg:block">Calendar</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center justify-center lg:justify-start space-x-2 px-2 hover:text-purple-500"
          >
            <Settings className="w-6 h-6" />
            <span className="hidden lg:block">Settings</span>
          </Link>
          <Link
            href="/help"
            className="flex items-center justify-center lg:justify-start space-x-2 px-2 hover:text-purple-500"
          >
            <HelpCircle className="w-6 h-6" />
            <span className="hidden lg:block">Help</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
