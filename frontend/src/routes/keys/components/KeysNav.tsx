import { NavLink } from "react-router-dom";

export default function KeysNav() {
  return (
    <div className="flex flex-col items-end pt-1 text-nowrap">
      <div className="flex space-x-1">
        {/* Add `end` prop to prevent sub-routes from marking this as active */}
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
          Key Dashboard
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
          Keyring Management
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
          Key Generation
        </NavLink>

        <NavLink
          to="/keys/signing"
          className={({ isActive }) =>
            `px-4 py-2 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 ${
              isActive
                ? "text-purple-500 dark:text-purple-400 font-semibold"
                : "text-gray-700 dark:text-gray-300"
            }`
          }
        >
          Key Signing
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
          Import Export
        </NavLink>
      </div>
    </div>
  );
}
