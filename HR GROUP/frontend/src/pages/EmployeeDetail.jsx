import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ProfileHeader from '../components/employee/ProfileHeader';
import EmployeeTimeline from '../components/employee/EmployeeTimeline';
import DepartmentBadge from '../components/employee/DepartmentBadge';
import EmployeeStatusBadge from '../components/employee/EmployeeStatusBadge';
import Card from '../components/Card';
import { useEmployees } from '../hooks/useEmployees';
import { formatDateDDMMYYYY } from '../utils/dateValidation';
import { FiUser, FiBriefcase, FiDollarSign, FiFileText, FiClock } from 'react-icons/fi';

const TABS = [
  { key: 'overview', label: 'Overview', icon: FiUser },
  { key: 'employment', label: 'Employment Details', icon: FiBriefcase },
  { key: 'salary', label: 'Salary & Bank', icon: FiDollarSign },
  { key: 'documents', label: 'Documents', icon: FiFileText },
  { key: 'timeline', label: 'Timeline & History', icon: FiClock },
];

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEmployee } = useEmployees();
  const [activeTab, setActiveTab] = useState('overview');

  const employee = getEmployee(id);

  if (!employee) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile Not Found" breadcrumbs={[{ label: 'Employees', path: '/employees' }]} />
        <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 mb-4">Employee ID "{id}" was not found in records.</p>
          <button
            onClick={() => navigate('/employees')}
            className="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-semibold"
          >
            Back to Employee Roster
          </button>
        </div>
      </div>
    );
  }

  const basicSalary = employee.salaryPackage?.basicSalary || 0;
  const allowances = employee.salaryPackage?.allowances || 0;
  const pfContribution = employee.salaryPackage?.pfContribution || 0;
  const totalCTC = employee.salaryPackage?.totalCTC || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${employee.name} — Profile`}
        breadcrumbs={[
          { label: 'Employees', path: '/employees' },
          { label: employee.id, path: `/employees/${employee.id}` },
        ]}
      />

      {/* Hero Profile Banner */}
      <ProfileHeader employee={employee} />

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <Card title="Personal Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div><span className="text-slate-400">Full Name:</span> <strong className="text-slate-800 dark:text-slate-200 block">{employee.name}</strong></div>
                <div><span className="text-slate-400">Gender:</span> <p className="font-semibold text-slate-800 dark:text-slate-200">{employee.gender || 'Not specified'}</p></div>
                <div><span className="text-slate-400">Date of Birth:</span> <p className="font-semibold text-slate-800 dark:text-slate-200">{formatDateDDMMYYYY(employee.dateOfBirth) || 'N/A'}</p></div>
                <div><span className="text-slate-400">Email Address:</span> <p className="font-semibold text-slate-800 dark:text-slate-200">{employee.email}</p></div>
                <div><span className="text-slate-400">Phone Number:</span> <p className="font-semibold text-slate-800 dark:text-slate-200">{employee.phone}</p></div>
                <div>
                  <span className="text-slate-400">Address:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {employee.address ? `${employee.address.street}, ${employee.address.city}, ${employee.address.state} ${employee.address.zipCode}` : 'Not provided'}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {(activeTab === 'overview' || activeTab === 'employment') && (
            <Card title="Employment Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div><span className="text-slate-400">Employee ID:</span> <p className="font-mono font-bold text-slate-800 dark:text-slate-200">{employee.id}</p></div>
                <div><span className="text-slate-400">Department:</span> <div className="mt-0.5"><DepartmentBadge department={employee.department} /></div></div>
                <div><span className="text-slate-400">Designation:</span> <p className="font-semibold text-slate-800 dark:text-slate-200">{employee.designation}</p></div>
                <div><span className="text-slate-400">Reporting Manager:</span> <p className="font-semibold text-slate-800 dark:text-slate-200">{employee.manager || 'N/A'}</p></div>
                <div><span className="text-slate-400">Employment Type:</span> <p className="font-semibold text-slate-800 dark:text-slate-200">{employee.employmentType}</p></div>
                <div><span className="text-slate-400">Work Location:</span> <p className="font-semibold text-slate-800 dark:text-slate-200">{employee.workLocation}</p></div>
                <div><span className="text-slate-400">Date of Joining:</span> <p className="font-semibold text-slate-800 dark:text-slate-200">{formatDateDDMMYYYY(employee.dateOfJoining || employee.joiningDate)}</p></div>
                <div><span className="text-slate-400">Status:</span> <div className="mt-0.5"><EmployeeStatusBadge status={employee.status} /></div></div>
              </div>
            </Card>
          )}

          {activeTab === 'salary' && (
            <Card title="Salary & Bank Breakdown">
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800">
                  <div><span className="text-slate-400">Basic Salary</span><p className="font-bold text-slate-900 dark:text-white text-sm">₹{basicSalary.toLocaleString('en-IN')}</p></div>
                  <div><span className="text-slate-400">Allowances</span><p className="font-bold text-slate-900 dark:text-white text-sm">₹{allowances.toLocaleString('en-IN')}</p></div>
                  <div><span className="text-slate-400">PF (12%)</span><p className="font-bold text-violet-600 dark:text-violet-400 text-sm">₹{pfContribution.toLocaleString('en-IN')}</p></div>
                  <div><span className="text-slate-400">Total CTC</span><p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">₹{totalCTC.toLocaleString('en-IN')}</p></div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div><span className="text-slate-400">Bank Name</span><p className="font-semibold text-slate-800 dark:text-slate-200">{employee.salaryPackage?.bankName || 'N/A'}</p></div>
                  <div><span className="text-slate-400">Account Number</span><p className="font-mono font-semibold text-slate-800 dark:text-slate-200">{employee.salaryPackage?.accountNumber || 'N/A'}</p></div>
                  <div><span className="text-slate-400">IFSC Code</span><p className="font-mono font-semibold text-slate-800 dark:text-slate-200">{employee.salaryPackage?.ifscCode || 'N/A'}</p></div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'documents' && (
            <Card title="Uploaded Documents">
              {employee.documents?.length > 0 ? (
                <div className="space-y-2">
                  {employee.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="flex items-center gap-3">
                        <FiFileText className="text-violet-500" size={18} />
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{doc.name}</p>
                          <p className="text-slate-400">{doc.type} · {doc.size} · Uploaded {doc.uploadedAt}</p>
                        </div>
                      </div>
                      <button className="text-violet-600 font-semibold hover:underline">Download</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">No documents uploaded for this profile.</p>
              )}
            </Card>
          )}

          {activeTab === 'timeline' && (
            <Card title="Activity & Onboarding Timeline">
              <EmployeeTimeline events={employee.timeline || []} />
            </Card>
          )}
        </div>

        {/* Right Column Summary */}
        <div className="space-y-6">
          <Card title="Quick Stats">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-400">Compliance Training</span>
                <span className="font-semibold text-emerald-600">Passed ✓</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-400">Documents Verified</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.documents?.length || 0} File(s)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">PF Status</span>
                <span className="font-semibold text-violet-600">{employee.salaryPackage?.pfEligibility ? 'Active' : 'N/A'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
