// opening collapsable window example:
// pressing on keys can navigate to the keys route (dashboard)
// but when clicked on the arrow down icon to show all the possible
// routes for that keys

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
      href: "/keys",
      label: "Keys",
      icon: KeyRound,
    },
    {
      href: "/files",
      label: "Files",
      icon: Files,
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

  return (
    <aside className="sm:flex-col sm:w-20 md:flex-col md:w-24 lg:w-52 md:h-screen md:bg-white dark:md:bg-background-dark dark:md:text-foreground md:shadow-lg md:p-4 md:items-start md:flex-shrink-0">
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
  );
}
