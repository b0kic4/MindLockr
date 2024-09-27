"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  isDesktop?: boolean;
}

export function NavItem({
  href,
  label,
  icon: Icon,
  onClick,
  isDesktop,
}: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center text-nowrap ${
        isDesktop ? "justify-center lg:justify-start" : ""
      } space-x-2 px-2 hover:text-purple-500 ${
        isActive ? "text-purple-500 font-semibold" : ""
      }`}
    >
      <Icon className="w-6 h-6" />
      <span className={`${isDesktop ? "hidden lg:block" : ""}`}>{label}</span>
    </Link>
  );
}
