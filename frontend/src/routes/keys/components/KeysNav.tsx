import { KeyRound, MessageSquare, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function KeysNav() {
  return (
    <div className="flex flex-col font-semibold items-center pt-4 text-center">
      <div className="grid grid-cols-1 md:grid-cols-1 w-full lg:flex gap-4">
        <NavLink
          to="/keys"
          end
          className={({ isActive }) =>
            `flex items-center justify-center px-6 py-2 rounded-lg cursor-pointer transition-colors duration-300 ${
              isActive
                ? "text-purple-500 dark:text-purple-400 font-semibold"
                : "text-gray-700 dark:text-gray-300"
            }`
          }
        >
          <KeyRound className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
          <span>Keys</span>
        </NavLink>
        <NavLink
          to="/keys/messages"
          className={({ isActive }) =>
            `flex items-center justify-center px-6 py-2 rounded-lg cursor-pointer transition-colors duration-300 ${
              isActive
                ? "text-purple-500 dark:text-purple-400 font-semibold"
                : "text-gray-700 dark:text-gray-300"
            }`
          }
        >
          <MessageSquare className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
          <span>Messages</span>
        </NavLink>
        <NavLink
          to="/keys/files"
          className={({ isActive }) =>
            `flex items-center justify-center px-6 py-2 rounded-lg cursor-pointer transition-colors duration-300 ${
              isActive
                ? "text-purple-500 dark:text-purple-400 font-semibold"
                : "text-gray-700 dark:text-gray-300"
            }`
          }
        >
          <FileText className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
          <span>Files</span>
        </NavLink>
      </div>
    </div>
  );
}
