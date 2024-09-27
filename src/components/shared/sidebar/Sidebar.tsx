"use client";

import { useSidebarStore } from "@/lib/globalState/sidebarStore";
import {
  DatabaseBackup,
  Files,
  Fingerprint,
  GlobeLock,
  Home,
  IdCard,
  KeyRound,
  Network,
  NotebookPen,
  UserPen,
  WalletMinimal,
  X,
} from "lucide-react";
import { NavItem } from "./NavItem";

export function Sidebar() {
  const navigationRoutes = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/files",
      label: "Files",
      icon: Files,
    },
    {
      href: "/keys",
      label: "Keys",
      icon: KeyRound,
    },
    {
      href: "/cipher",
      label: "Cipher",
      icon: GlobeLock,
    },
    {
      href: "/credentials",
      label: "Credentials",
      icon: UserPen,
    },
    {
      href: "/wallet",
      label: "Wallet",
      icon: WalletMinimal,
    },
    {
      href: "/network",
      label: "Network",
      icon: Network,
    },
    {
      href: "/personal",
      label: "Personal",
      icon: IdCard,
    },
    {
      href: "/notes",
      label: "Notes",
      icon: NotebookPen,
    },
    {
      href: "/biometrics",
      label: "Biometrics",
      icon: Fingerprint,
    },
    {
      href: "/backups",
      label: "Backups",
      icon: DatabaseBackup,
    },
  ];

  const { isSidebarOpen, setSidebarOpen } = useSidebarStore();

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-52 bg-white dark:bg-background dark:text-foreground shadow-lg p-4 flex flex-col items-start z-20 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        {/* Close Icon */}
        <div className="flex justify-end w-full">
          <button
            onClick={handleCloseSidebar}
            className="text-gray-500 dark:text-gray-300 focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-4 mt-8 w-full">
          {navigationRoutes.map((route) => (
            <NavItem
              key={route.href}
              href={route.href}
              label={route.label}
              icon={route.icon}
              onClick={handleCloseSidebar}
            />
          ))}
        </nav>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={handleCloseSidebar}
        ></div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-20 lg:w-52 md:h-screen md:bg-white dark:md:bg-background dark:md:text-foreground md:shadow-lg md:p-4 md:items-start md:flex-shrink-0">
        {/* Navigation */}
        <nav className="flex flex-col space-y-4 mt-8 w-full">
          {navigationRoutes.map((route) => (
            <NavItem
              key={route.href}
              href={route.href}
              label={route.label}
              icon={route.icon}
              isDesktop
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
