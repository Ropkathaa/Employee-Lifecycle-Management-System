import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiUsers, FiCalendar, FiClipboard, FiUser, FiSettings, FiX, FiFileText, FiBookOpen, FiBell } from 'react-icons/fi';

const navItems = [
  { to: '/', icon: FiGrid, label: 'Dashboard' },
  { to: '/employees', icon: FiUsers, label: 'Employees' },
  { to: '/attendance', icon: FiCalendar, label: 'Attendance' },
  { to: '/leaves', icon: FiClipboard, label: 'Leave Management' },
  { to: '/documents', icon: FiFileText, label: 'Documents' },
  { to: '/training', icon: FiBookOpen, label: 'Training' },
  { to: '/notifications', icon: FiBell, label: 'Notifications' },
  { to: '/profile', icon: FiUser, label: 'Profile' },
  { to: '/settings', icon: FiSettings, label: 'Settings' },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
<aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold text-primary-600">EmployeeHub</h1>
          <button onClick={onClose} className="md:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <FiX className="w-5 h-5 dark:text-gray-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

