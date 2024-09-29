import { ModeToggle } from "@/components/mode-toggle";
import logo from "@/assets/images/logo-universal.png";
import { Navbar } from "./Navbar";

export function TopNav() {
  return (
    <div className="w-full h-16 bg-background dark:bg-background-dark shadow-md flex items-center relative px-4">
      {/* Logo for small screens */}
      <div className="flex md:hidden">
        <div className="w-12 h-12">
          <img src={logo} alt="Logo" width={48} height={48} />
        </div>
      </div>

      {/* Logo and Title for medium and larger screens */}
      <div className="hidden md:flex items-center space-x-2">
        {/* Logo */}
        <div className="w-12 h-12">
          <img src="/128x128.png" alt="Icon" width={48} height={48} />
        </div>
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          MindLockr
        </h3>
      </div>

      {/* Navbar Centered */}
      <div className="flex-1 flex justify-center">
        <Navbar />
        <ModeToggle />
      </div>
    </div>
  );
}
