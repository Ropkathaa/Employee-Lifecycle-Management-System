import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiPhone, FiCalendar, FiMapPin, FiBriefcase } from 'react-icons/fi';
import { EMPLOYEE_STATUS, EMPLOYEE_STATUS_COLORS, FORMAT_DATE } from '../utils/constants';
import { getInitials } from '../utils/helpers';

const EmployeeDetail = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
<Link to="/employees" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <FiArrowLeft className="w-5 h-5 dark:text-gray-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Employee Details</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage employee information</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-start gap-6">
<div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <span className="text-primary-700 dark:text-primary-300 text-2xl font-bold">JD</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold dark:text-gray-100">John Doe</h2>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${EMPLOYEE_STATUS_COLORS[EMPLOYEE_STATUS.ACTIVE]}`}>
                Active
              </span>
            </div>
<p className="text-gray-500 dark:text-gray-400 mt-1">Senior Developer</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <FiMail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                john.doe@example.com
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <FiPhone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <FiCalendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                Joined {FORMAT_DATE('2023-01-15')}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <FiMapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                New York, USA
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <FiBriefcase className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                Engineering Department
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<div className="card text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Attendance Rate</p>
          <p className="text-2xl font-bold text-green-600 mt-2">96%</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Leaves Taken</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">4</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Projects Completed</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">12</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;

