import React, { useEffect } from 'react';
import { FiMenu, FiSearch } from 'react-icons/fi';
import { useEmployee } from '../context/EmployeeContext';
import NotificationBadge from './NotificationBadge';
import ProfileDropdown from './ProfileDropdown';

const Header = ({ onMenuClick }) => {
  const { profile, fetchProfile } = useEmployee();

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  return (
<header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
          >
            <FiMenu className="w-5 h-5 dark:text-gray-300" />
          </button>
          <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
            <FiSearch className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search employees..."
              className="bg-transparent outline-none text-sm w-64 dark:text-gray-200 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <NotificationBadge />
          <ProfileDropdown employee={profile} />
        </div>
      </div>
    </header>
  );
};

export default Header;

