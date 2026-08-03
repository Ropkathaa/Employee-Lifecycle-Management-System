import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiMail,
  FiChevronDown,
} from 'react-icons/fi';
import { getInitials } from '../utils/helpers';

const ProfileDropdown = ({ employee }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fullName = employee
    ? `${employee.firstName || ''} ${employee.lastName || ''}`.trim()
    : 'User';
  const initials = getInitials(fullName);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setOpen(false);
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
<button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">{initials}</span>
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
          {fullName}
        </span>
        <FiChevronDown
          className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fade-in">
          {/* Profile Header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                {employee?.avatar ? (
                  <img
                    src={employee.avatar}
                    alt={fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-primary-600 dark:text-primary-400 text-lg font-bold">{initials}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{fullName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {employee?.employeeId || ''}
                </p>
              </div>
            </div>
            <div className="mt-2 space-y-1">
              {employee?.department && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Dept:</span> {employee.department}
                </p>
              )}
              {employee?.position && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Role:</span> {employee.position}
                </p>
              )}
              {employee?.email && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <FiMail className="w-3 h-3" />
                  <span className="truncate">{employee.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-2 pt-2 pb-1">
            <p className="px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
              Quick Actions
            </p>
            <button
              onClick={() => handleNavigate('/profile')}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
            >
              <FiUser className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              My Profile
            </button>
            <button
              onClick={() => handleNavigate('/settings')}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
            >
              <FiSettings className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              Settings
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1 px-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-150"
            >
              <FiLogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
