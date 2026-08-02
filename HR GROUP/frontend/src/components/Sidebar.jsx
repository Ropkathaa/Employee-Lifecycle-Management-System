import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiUsers,
  FiFileText,
  FiMail,
  FiDollarSign,
  FiBookOpen,
  FiBarChart2,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiX
} from 'react-icons/fi';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { path: '/employees', label: 'Employees', icon: FiUsers },
  { path: '/documents', label: 'Documents', icon: FiFileText },
  { path: '/offers', label: 'Offer Packets', icon: FiMail },
  { path: '/salary', label: 'Salary Summary', icon: FiDollarSign },
  { path: '/training', label: 'Mandatory Training', icon: FiBookOpen },
  { path: '/reports', label: 'Reports', icon: FiBarChart2 },
  { path: '/settings', label: 'Settings', icon: FiSettings },
];

export default function Sidebar({
  isCollapsed = false,
  onToggle,
  isMobileOpen = false,
  onCloseMobile,
}) {
  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Sidebar Branding Header */}
      <div className="h-[72px] flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20">
            H
          </div>
          {!isCollapsed && (
            <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
              HR Platform
            </span>
          )}
        </div>
        
        {/* Toggle / Close Buttons */}
        {onToggle && !isMobileOpen && (
          <button
            onClick={onToggle}
            className="hidden md:flex items-center justify-center p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors min-h-[32px] min-w-[32px]"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
          </button>
        )}
        
        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className="md:hidden flex items-center justify-center p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors min-h-[44px] min-w-[44px]"
            aria-label="Close sidebar menu"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all group min-h-[44px] ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold border-l-4 border-primary rounded-l-none'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              <Icon size={18} className="flex-shrink-0 group-hover:scale-105 transition-transform" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-semibold text-slate-600 dark:text-slate-300">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                Admin User
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                admin@hrplatform.com
              </p>
            </div>
          </div>
        ) : (
          <div className="h-9 w-9 mx-auto rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-semibold text-slate-600 dark:text-slate-300">
            AD
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Container */}
      <aside
        className={`hidden md:block h-screen sticky top-0 flex-shrink-0 transition-all duration-300 z-30 ${
          isCollapsed ? 'w-20' : 'w-[260px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer Menu Content */}
      <aside
        className={`md:hidden fixed top-0 bottom-0 left-0 w-[260px] z-50 transition-transform duration-300 transform bg-white dark:bg-slate-900 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
