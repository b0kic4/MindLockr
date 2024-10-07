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
    { href: "/", label: "Home", icon: Home },
    { href: "/keys", label: "Keys", icon: KeyRound },
    { href: "/files", label: "Files", icon: Files },
    { href: "/cipher", label: "Cipher", icon: GlobeLock },
    { href: "/credentials", label: "Credentials", icon: UserPen },
    { href: "/wallet", label: "Wallet", icon: WalletMinimal },
    { href: "/network", label: "Network", icon: Network },
    { href: "/personal", label: "Personal", icon: IdCard },
    { href: "/notes", label: "Notes", icon: NotebookPen },
    { href: "/backups", label: "Backups", icon: DatabaseBackup },
  ];

  return (
    <aside className="sticky top-0 sm:w-20 md:w-24 lg:w-44 h-screen bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark p-4 flex-shrink-0">
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
