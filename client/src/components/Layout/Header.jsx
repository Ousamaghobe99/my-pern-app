import React from "react";
import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAuth } from "../../contexts/AuthContext";
import NotificationCenter from "../NotificationCenter";

const Header = ({ onMenuClick, isDark, onThemeToggle }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b bg-background px-4 md:px-6 h-16">
  {/* Mobile menu button */}
  <Button
    variant="ghost"
    size="icon"
    className="lg:hidden"
    onClick={onMenuClick}
  >
    <Menu className="h-5 w-5" />
    <span className="sr-only">Toggle menu</span>
  </Button>

  {/* Search bar */}
  <div className="flex-1 min-w-0">
    <Input
      type="search"
      placeholder="Search interfaces, locations..."
      className="pl-8 w-full max-w-[600px]" // max width for very large screens
    />
  </div>

  {/* Right side actions */}
  <div className="flex items-center gap-2 ml-auto">
    {/* Theme toggle */}
    <Button variant="ghost" size="icon" onClick={onThemeToggle}>
      {isDark ? (
        <Sun className="h-4 w-4 text-yellow-400" />
      ) : (
        <Moon className="h-4 w-4 text-gray-700" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>

    {/* Notifications */}
    <NotificationCenter />

    {/* User info */}
    <div className="hidden md:flex items-center gap-2 text-sm">
      <div className="text-right">
        <p className="font-medium">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-muted-foreground text-xs">{user?.role?.name}</p>
      </div>
    </div>
  </div>
</header>

  );
};

export default Header;
