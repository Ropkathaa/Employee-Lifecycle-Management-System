import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeAvatar from './EmployeeAvatar';
import EmployeeStatusBadge from './EmployeeStatusBadge';
import DepartmentBadge from './DepartmentBadge';
import { FiEye, FiEdit2, FiChevronUp, FiChevronDown, FiUsers } from 'react-icons/fi';

/**
 * EmployeeTable — enterprise data table with sorting, row selection, bulk action bar,
 * pagination controls, loading state, and empty state.
 */
export default function EmployeeTable({
  employees = [],
  selectedIds = [],
  onSelectAll,
  onSelectRow,
  sortField = 'id',
  sortDirection = 'asc',
  onSort,
  page = 1,
  totalPages = 1,
  onPageChange,
  loading = false,
}) {
  const navigate = useNavigate();
  const allSelected = employees.length > 0 && employees.every((e) => selectedIds.includes(e.id));
  const isSomeSelected = selectedIds.length > 0 && !allSelected;

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />;
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden space-y-0">
      {/* Bulk Action Bar (when rows selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-violet-50 dark:bg-violet-950/40 border-b border-violet-200 dark:border-violet-800 px-5 py-2.5 flex items-center justify-between">
          <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">
            {selectedIds.length} employee{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Bulk export ${selectedIds.length} profiles`)}
              className="text-xs font-semibold px-2.5 py-1 rounded bg-violet-600 text-white hover:bg-violet-700 transition-colors"
            >
              Export Selected
            </button>
            <button
              onClick={() => onSelectAll(false)}
              className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[840px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
              {/* Checkbox Column */}
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => el && (el.indeterminate = isSomeSelected)}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  aria-label="Select all employees"
                  className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 w-4 h-4 cursor-pointer"
                />
              </th>
              {/* Employee ID */}
              <th
                onClick={() => onSort('id')}
                className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Employee ID</span>
                  {renderSortIcon('id')}
                </div>
              </th>
              {/* Profile / Full Name */}
              <th
                onClick={() => onSort('name')}
                className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Employee</span>
                  {renderSortIcon('name')}
                </div>
              </th>
              {/* Department */}
              <th
                onClick={() => onSort('department')}
                className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Department</span>
                  {renderSortIcon('department')}
                </div>
              </th>
              {/* Designation */}
              <th className="py-3 px-4">Designation</th>
              {/* Joining Date */}
              <th
                onClick={() => onSort('dateOfJoining')}
                className="py-3 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Joining Date</span>
                  {renderSortIcon('dateOfJoining')}
                </div>
              </th>
              {/* Employment Type */}
              <th className="py-3 px-4">Type</th>
              {/* Status */}
              <th className="py-3 px-4">Status</th>
              {/* Actions */}
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-sm text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span>Loading employees…</span>
                  </div>
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                  <FiUsers className="mx-auto mb-2 opacity-50" size={32} />
                  No employee records match your active filters.
                </td>
              </tr>
            ) : (
              employees.map((emp) => {
                const isSelected = selectedIds.includes(emp.id);
                return (
                  <tr
                    key={emp.id}
                    className={`hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors ${
                      isSelected ? 'bg-violet-50/50 dark:bg-violet-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectRow(emp.id)}
                        aria-label={`Select ${emp.name}`}
                        className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4 text-xs font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {emp.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <EmployeeAvatar
                          initials={emp.avatarInitials}
                          color={emp.avatarColor}
                          name={emp.name}
                          size="md"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                            {emp.name}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <DepartmentBadge department={emp.department} />
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                      {emp.designation}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {new Date(emp.dateOfJoining).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">
                      {emp.employmentType || 'Full-Time'}
                    </td>
                    <td className="py-3 px-4">
                      <EmployeeStatusBadge status={emp.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/employees/${emp.id}`)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="View Profile"
                          aria-label={`View ${emp.name}'s profile`}
                        >
                          <FiEye size={15} />
                        </button>
                        <button
                          onClick={() => navigate(`/employees/${emp.id}/edit`)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Edit Profile"
                          aria-label={`Edit ${emp.name}'s profile`}
                        >
                          <FiEdit2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 gap-3">
        <span>
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>
        <div className="flex items-center gap-1.5">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
