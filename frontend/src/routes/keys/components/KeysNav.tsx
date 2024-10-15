import { NavLink } from "react-router-dom";

export default function KeysNav() {
  return (
    <div className="flex flex-col font-semibold items-end pt-1 text-nowrap">
      <div className="grid grid-cols-1 md:grid-cols-1 w-full lg:flex">
        <NavLink
          to="/keys"
          end
          className={({ isActive }) =>
            `px-4 py-2 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 ${
              isActive
                ? "text-purple-500 dark:text-purple-400 font-semibold"
                : "text-gray-700 dark:text-gray-300"
            }`
          }
        >
          PGP Keys
        </NavLink>
        <NavLink
          to="/keys/keyring"
          className={({ isActive }) =>
            `px-4 py-2 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 ${
              isActive
                ? "text-purple-500 dark:text-purple-400 font-semibold"
                : "text-gray-700 dark:text-gray-300"
            }`
          }
        >
          Keyring & Message Vault
        </NavLink>

        <NavLink
          to="/keys/generate"
          className={({ isActive }) =>
            `px-4 py-2 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 ${
              isActive
                ? "text-purple-500 dark:text-purple-400 font-semibold"
                : "text-gray-700 dark:text-gray-300"
            }`
          }
        >
          Key / Message Generation
        </NavLink>

        <NavLink
          to="/keys/import-export"
          className={({ isActive }) =>
            `px-4 py-2 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 ${
              isActive
                ? "text-purple-500 dark:text-purple-400 font-semibold"
                : "text-gray-700 dark:text-gray-300"
            }`
          }
        >
          Import / Export Keys & Messages
        </NavLink>
      </div>
    </div>
  );
}
