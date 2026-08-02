import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import EmployeeForm from '../components/employee/EmployeeForm';
import DepartmentBadge from '../components/employee/DepartmentBadge';
import { useEmployees } from '../hooks/useEmployees';
import { formatDateDDMMYYYY } from '../utils/dateValidation';
import {
  FiCheckCircle, FiUser, FiList, FiPlus, FiGrid,
  FiMail, FiCalendar, FiBriefcase,
} from 'react-icons/fi';

export default function EmployeeCreate() {
  const navigate = useNavigate();
  const { createEmployee } = useEmployees();
  const [createdEmployee, setCreatedEmployee] = useState(null);

  const handleCreateSubmit = async (newEmployeeData) => {
    // 1. Create employee via domain service / context hook
    const created = await createEmployee(newEmployeeData);
    // 2. Set local state to render Success Screen
    setCreatedEmployee(created);
  };

  const handleCreateAnother = () => {
    setCreatedEmployee(null);
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Header & Breadcrumbs */}
      <PageHeader
        title={createdEmployee ? 'Employee Created Successfully' : 'Create Employee Profile'}
        breadcrumbs={
          createdEmployee
            ? [
                { label: 'Employees', path: '/employees' },
                { label: 'Create Profile', path: '/employees/create' },
                { label: 'Success', path: '#' },
              ]
            : [
                { label: 'Employees', path: '/employees' },
                { label: 'Create Profile', path: '/employees/create' },
              ]
        }
      />

      {!createdEmployee ? (
        /* 5-Step Wizard Form */
        <EmployeeForm onSubmit={handleCreateSubmit} isEdit={false} />
      ) : (
        /* Post-Creation Success View */
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Success Hero Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 shadow-md">
              <FiCheckCircle size={36} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Employee Successfully Created!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Profile record has been generated and synchronized across the platform roster, search index, and dashboard analytics.
            </p>
          </div>

          {/* Profile Summary Card */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {createdEmployee.name}
                </p>
                <p className="text-xs text-violet-600 dark:text-violet-400 font-semibold mt-0.5">
                  {createdEmployee.designation}
                </p>
              </div>
              <span className="font-mono font-bold text-xs bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 px-3 py-1 rounded-lg border border-violet-200 dark:border-violet-800">
                {createdEmployee.id}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2">
                <FiBriefcase className="text-slate-400 flex-shrink-0" size={14} />
                <span className="text-slate-500">Department:</span>
                <DepartmentBadge department={createdEmployee.department} />
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="text-slate-400 flex-shrink-0" size={14} />
                <span className="text-slate-500">Joining Date:</span>
                <strong className="text-slate-800 dark:text-slate-200">
                  {formatDateDDMMYYYY(createdEmployee.dateOfJoining)}
                </strong>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <FiMail className="text-slate-400 flex-shrink-0" size={14} />
                <span className="text-slate-500">Primary Email:</span>
                <strong className="text-slate-800 dark:text-slate-200 truncate">
                  {createdEmployee.email}
                </strong>
              </div>
            </div>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => navigate(`/employees/${createdEmployee.id}`)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all min-h-[44px]"
            >
              <FiUser size={15} />
              View Employee Profile
            </button>
            <button
              onClick={() => navigate('/employees')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold shadow-sm transition-all min-h-[44px]"
            >
              <FiList size={15} />
              Go to Employee List
            </button>
            <button
              onClick={handleCreateAnother}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold shadow-sm transition-all min-h-[44px]"
            >
              <FiPlus size={15} />
              Create Another Employee
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold shadow-sm transition-all min-h-[44px]"
            >
              <FiGrid size={15} />
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
