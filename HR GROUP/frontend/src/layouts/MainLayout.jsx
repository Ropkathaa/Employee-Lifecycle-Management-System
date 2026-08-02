import React from 'react';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      {/* Mini public header */}
      <header className="h-[72px] border-b border-border bg-surface flex items-center px-6 justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
            H
          </div>
          <span className="font-semibold text-slate-800 dark:text-white text-sm">
            HR Platform
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-8">
        <Outlet />
      </main>

      {/* Mini footer */}
      <footer className="h-16 border-t border-border bg-surface flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
        <span>© 2026 Enterprise HR Automation. All rights reserved.</span>
      </footer>
    </div>
  );
}
