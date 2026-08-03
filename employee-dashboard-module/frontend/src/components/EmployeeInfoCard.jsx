import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiBriefcase,
  FiCalendar,
  FiMail,
  FiPhone,
  FiChevronRight,
  FiShield,
} from 'react-icons/fi';
import { getInitials } from '../utils/helpers';
import { FORMAT_DATE } from '../utils/constants';

const EmployeeInfoCard = ({ employee }) => {
  const navigate = useNavigate();

  if (!employee) return null;

  const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
  const initials = getInitials(fullName);

  const infoItems = [
    { label: 'Employee ID', value: employee.employeeId || '—', icon: FiShield },
    { label: 'Department', value: employee.department || '—', icon: FiBriefcase },
    { label: 'Designation', value: employee.position || '—', icon: FiUser },
    { label: 'Joining Date', value: employee.joinDate ? FORMAT_DATE(employee.joinDate) : '—', icon: FiCalendar },
    { label: 'Official Email', value: employee.email || '—', icon: FiMail },
    { label: 'Phone Number', value: employee.phone || '—', icon: FiPhone },
  ];

  return (
    <div className="card overflow-hidden p-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
        <h2 className="text-lg font-bold text-white">Employee Information</h2>
      </div>

      <div className="p-6">
        {/* Profile Picture + Name */}
<div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
          <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            {employee.avatar ? (
              <img
                src={employee.avatar}
                alt={fullName}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <span className="text-primary-600 dark:text-primary-300 text-xl font-bold">{initials}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">{fullName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{employee.position || employee.department || 'Employee'}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {infoItems.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
<div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                <item.icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View Profile Button */}
        <button
          onClick={() => navigate('/profile')}
className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          View Profile
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EmployeeInfoCard;
