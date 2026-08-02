import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeAvatar from './EmployeeAvatar';
import EmployeeStatusBadge from './EmployeeStatusBadge';
import DepartmentBadge from './DepartmentBadge';
import { FiEdit2, FiMail, FiPhone, FiMapPin, FiCalendar, FiBriefcase } from 'react-icons/fi';

/**
 * Reusable Profile Header banner for Employee Detail page.
 */
export default function ProfileHeader({ employee }) {
  const navigate = useNavigate();

  if (!employee) return null;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm relative overflow-hidden">
      {/* Top Banner Background Accent */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-emerald-600/20" />

      {/* Main Content */}
      <div className="relative pt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* Left Column: Avatar + Basic Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
          <EmployeeAvatar
            initials={employee.avatarInitials}
            color={employee.avatarColor}
            name={employee.name}
            size="xl"
            status={employee.status}
            className="ring-4 ring-white dark:ring-slate-800 shadow-md"
          />

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {employee.name}
              </h1>
              <EmployeeStatusBadge status={employee.status} />
              <DepartmentBadge department={employee.department} />
            </div>

            <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">
              {employee.designation}
            </p>

            {/* Quick Metadata Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                {employee.id}
              </span>
              <span className="flex items-center gap-1">
                <FiMail size={13} className="text-slate-400" />
                {employee.email}
              </span>
              <span className="flex items-center gap-1">
                <FiPhone size={13} className="text-slate-400" />
                {employee.phone}
              </span>
              {employee.workLocation && (
                <span className="flex items-center gap-1">
                  <FiMapPin size={13} className="text-slate-400" />
                  {employee.workLocation}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/employees/${employee.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs shadow-sm transition-all min-h-[44px]"
          >
            <FiEdit2 size={14} />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
