import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeAvatar from './EmployeeAvatar';
import EmployeeStatusBadge from './EmployeeStatusBadge';
import DepartmentBadge from './DepartmentBadge';
import { FiMail, FiPhone, FiCalendar, FiMapPin, FiEye, FiEdit2 } from 'react-icons/fi';

/**
 * Reusable Card component representing an employee profile in Grid view.
 */
export default function EmployeeCard({ employee }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between group">
      {/* Top Banner & Status */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <EmployeeAvatar
            initials={employee.avatarInitials}
            color={employee.avatarColor}
            name={employee.name}
            size="lg"
            status={employee.status}
          />
          <EmployeeStatusBadge status={employee.status} />
        </div>

        {/* Name & Designation */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
          {employee.name}
        </h3>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
          {employee.designation}
        </p>

        {/* Department */}
        <div className="mb-4">
          <DepartmentBadge department={employee.department} />
        </div>

        {/* Contact Info List */}
        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-3">
          <div className="flex items-center gap-2 truncate">
            <FiMail size={13} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiPhone size={13} className="text-slate-400 flex-shrink-0" />
            <span>{employee.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar size={13} className="text-slate-400 flex-shrink-0" />
            <span>
              Joined {new Date(employee.dateOfJoining).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </span>
          </div>
          {employee.workLocation && (
            <div className="flex items-center gap-2">
              <FiMapPin size={13} className="text-slate-400 flex-shrink-0" />
              <span>{employee.workLocation} Location</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 mt-4 pt-3">
        <span className="text-[11px] font-mono text-slate-400 font-medium">{employee.id}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/employees/${employee.id}`)}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            <FiEye size={13} /> View
          </button>
          <button
            onClick={() => navigate(`/employees/${employee.id}/edit`)}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <FiEdit2 size={13} /> Edit
          </button>
        </div>
      </div>
    </div>
  );
}
