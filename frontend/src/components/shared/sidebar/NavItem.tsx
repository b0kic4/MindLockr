import { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

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
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center text-nowrap ${
          isDesktop ? "justify-center lg:justify-start" : ""
        } space-x-2 px-2 transition-colors duration-300 hover:text-purple-500 dark:hover:text-purple-400 ${
          isActive
            ? "text-purple-500 dark:text-purple-400 font-semibold"
            : "text-gray-700 dark:text-gray-300"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`w-6 h-6 transition-colors duration-300 ${
              isActive
                ? "text-purple-500 dark:text-purple-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          />
          <span className={`${isDesktop ? "hidden lg:block" : ""}`}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}
