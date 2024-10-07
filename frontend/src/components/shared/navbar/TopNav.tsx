import logo from "@/assets/images/logo-universal.png";
import { ModeToggle } from "@/components/mode-toggle";

export function TopNav() {
  return (
    <div className="w-full h-16 bg-background dark:bg-background-dark shadow-sm dark:shadow-md flex items-center relative px-4">
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
          <img src={logo} alt="Logo" width={48} height={48} />
        </div>
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          MindLockr
        </h3>
      </div>

      <div className="flex-1 flex justify-between items-center">
        <p className="hidden md:block text-center text-foreground dark:text-foreground-dark mx-auto font-semibold">
          MindLockr: Secure Your Files, Safeguard Your Privacy.
        </p>

        <div className="ml-auto">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
