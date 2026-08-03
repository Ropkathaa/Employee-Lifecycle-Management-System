import React, { useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiBriefcase, FiLoader } from 'react-icons/fi';
import { EMPLOYEE_STATUS_COLORS, FORMAT_DATE } from '../utils/constants';
import { getInitials } from '../utils/helpers';
import { useEmployee } from '../context/EmployeeContext';

const EmployeeList = () => {
  const { profile, profileLoading, fetchProfile } = useEmployee();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (profileLoading && !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  const fullName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'N/A';
  const initials = getInitials(fullName);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Employee Details</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Your employment information at a glance</p>
      </div>

      {/* Main Profile Card */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-start gap-6">
<div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary-700 dark:text-primary-300 text-2xl font-bold">{initials}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{fullName}</h2>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  EMPLOYEE_STATUS_COLORS['active'] || 'bg-gray-100 text-gray-800'
                }`}
              >
                Active
              </span>
            </div>
<p className="text-gray-500 dark:text-gray-400 mt-1">
              {profile?.position || 'N/A'}
              {profile?.department ? ` — ${profile.department}` : ''}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Employee ID: {profile?.employeeId || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="card">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <FiUser className="w-4 h-4" />
          </div>
<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contact Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex items-start gap-3">
<FiMail className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Email</p>
              <p className="text-sm text-gray-700 dark:text-gray-200">{profile?.email || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
<FiPhone className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Phone</p>
              <p className="text-sm text-gray-700 dark:text-gray-200">{profile?.phone || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
<FiMapPin className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Location</p>
              <p className="text-sm text-gray-700 dark:text-gray-200">{profile?.location || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Employment Details */}
      <div className="card">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <FiBriefcase className="w-4 h-4" />
          </div>
<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Employment Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex items-start gap-3">
<FiBriefcase className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Department</p>
              <p className="text-sm text-gray-700 dark:text-gray-200">{profile?.department || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
<FiUser className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Position</p>
              <p className="text-sm text-gray-700 dark:text-gray-200">{profile?.position || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
<FiCalendar className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Join Date</p>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                {profile?.joinDate ? FORMAT_DATE(profile.joinDate) : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
<FiUser className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Employee ID</p>
              <p className="text-sm text-gray-700 dark:text-gray-200">{profile?.employeeId || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty state if no profile */}
      {!profile && !profileLoading && (
        <div className="card text-center py-12">
<FiUser className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No employee profile found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Your profile information will appear here once available.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;

