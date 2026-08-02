import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import EmployeeForm from '../components/employee/EmployeeForm';
import { useEmployees } from '../hooks/useEmployees';

export default function EmployeeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEmployee, updateEmployee } = useEmployees();

  const employee = getEmployee(id);

  if (!employee) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile Not Found" breadcrumbs={[{ label: 'Employees', path: '/employees' }]} />
        <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 mb-4">Cannot edit profile — Employee ID "{id}" was not found.</p>
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

  const handleEditSubmit = async (updatedEmployee) => {
    await updateEmployee(id, updatedEmployee);
    navigate(`/employees/${updatedEmployee.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Profile — ${employee.name}`}
        breadcrumbs={[
          { label: 'Employees', path: '/employees' },
          { label: employee.id, path: `/employees/${employee.id}` },
          { label: 'Edit', path: `/employees/${employee.id}/edit` },
        ]}
      />

      <EmployeeForm initialData={employee} onSubmit={handleEditSubmit} isEdit={true} />
    </div>
  );
}
