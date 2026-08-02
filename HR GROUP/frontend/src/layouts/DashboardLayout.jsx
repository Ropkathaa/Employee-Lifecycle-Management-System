import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const openMobileSidebar = () => {
    setIsMobileOpen(true);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      {/* Sidebar Navigation Panel (Responsive) */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
        isMobileOpen={isMobileOpen}
        onCloseMobile={closeMobileSidebar}
      />

      {/* Main Page Layout Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Header Navbar */}
        <Navbar
          onOpenMobileSidebar={openMobileSidebar}
          isMobileOpen={isMobileOpen}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="w-full max-w-[1600px] mx-auto flex flex-col min-h-[calc(100vh-72px-120px)]">
            <Outlet />
          </div>
          
          {/* Dashboard Footer */}
          <footer className="w-full max-w-[1600px] mx-auto border-t border-slate-200 dark:border-slate-800 mt-12 pt-6 pb-2 text-center text-xs text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <span>© 2026 Enterprise HR Automation. All rights reserved.</span>
            <span>Version 1.0.0 (Setup Phase)</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
