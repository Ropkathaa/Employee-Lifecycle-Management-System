import React, { useEffect, useState } from 'react';
import { FiMenu, FiSun, FiMoon, FiBell, FiSearch, FiChevronDown, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';

export default function Navbar({ onOpenMobileSidebar, isMobileOpen }) {
  const [isDark, setIsDark] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Sync React state with what the blocking HTML script already applied.
  // We only read localStorage — no OS preference — so every device behaves the same.
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const shouldBeDark = savedTheme === 'dark';
    document.documentElement.classList.toggle('dark', shouldBeDark);
    setIsDark(shouldBeDark);
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 h-[72px] border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between">
      {/* Left items: Mobile Sidebar Hamburger & Logo */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden flex items-center justify-center p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg focus:outline-none min-h-[44px] min-w-[44px]"
          aria-label="Open sidebar menu"
        >
          <FiMenu size={20} />
        </button>

        {/* Mobile branding */}
        <div className="md:hidden flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
            H
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
            HR Platform
          </span>
        </div>

        {/* Desktop Search bar stub */}
        <div className="hidden md:flex relative w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary focus:bg-white dark:focus:bg-slate-800 text-xs rounded-lg outline-none py-1.5 pl-9 pr-3 transition-all text-slate-800 dark:text-white placeholder-slate-400"
            placeholder="Quick search..."
          />
        </div>
      </div>

      {/* Right items: Actions, Theme, Alerts, User Profile */}
      <div className="flex items-center space-x-3.5">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Toggle theme mode"
        >
          {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* Notifications Popover Toggle Button */}
        <button
          className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center relative"
          aria-label="View notifications"
        >
          <FiBell size={18} />
          <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

        {/* User profile dropdown container */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] text-slate-700 dark:text-slate-200"
            aria-haspopup="true"
            aria-expanded={showProfileDropdown}
          >
            <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
              A
            </div>
            <span className="hidden sm:inline text-xs font-medium">Admin</span>
            <FiChevronDown size={14} className="text-slate-400" />
          </button>

          {/* Profile Dropdown panel */}
          {showProfileDropdown && (
            <>
              {/* Invisible overlay to close dropdown */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowProfileDropdown(false)} 
              />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl py-1 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  onClick={() => setShowProfileDropdown(false)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center space-x-2"
                >
                  <FiUser size={14} />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => setShowProfileDropdown(false)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center space-x-2"
                >
                  <FiSettings size={14} />
                  <span>Settings</span>
                </button>
                <div className="border-t border-slate-200 dark:border-slate-700 my-1" />
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    console.log('Logging out...');
                  }}
                  className="w-full min-h-[44px] px-3.5 py-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 transition-colors flex items-center space-x-2"
                >
                  <FiLogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
