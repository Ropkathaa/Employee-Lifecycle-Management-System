import React from 'react';
import SearchBar from '../SearchBar';
import { DEPARTMENTS, EMPLOYEE_STATUSES, EMPLOYMENT_TYPES } from '../../mock/employees';
import { FiRotateCcw, FiFilter } from 'react-icons/fi';

/**
 * Reusable Employee Filters bar for live searching and multi-attribute filtering.
 */
export default function EmployeeFilters({
  searchTerm = '',
  onSearchChange,
  department = '',
  onDepartmentChange,
  status = '',
  onStatusChange,
  employmentType = '',
  onEmploymentTypeChange,
  onReset,
  totalCount = 0,
  filteredCount = 0,
}) {
  const hasActiveFilters = Boolean(searchTerm || department || status || employmentType);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm space-y-3">
      {/* Top Search + Filter Selects */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        {/* Search Input */}
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, employee ID, or email…"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          {/* Department Filter */}
          <select
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[44px]"
            aria-label="Filter by Department"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[44px]"
            aria-label="Filter by Status"
          >
            <option value="">All Statuses</option>
            {EMPLOYEE_STATUSES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          {/* Employment Type Filter */}
          <select
            value={employmentType}
            onChange={(e) => onEmploymentTypeChange(e.target.value)}
            className="text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[44px]"
            aria-label="Filter by Employment Type"
          >
            <option value="">All Employment Types</option>
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors min-h-[44px]"
              aria-label="Reset all filters"
            >
              <FiRotateCcw size={13} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Filter Status Summary Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <FiFilter size={12} className="text-primary" />
          Showing <strong className="text-slate-800 dark:text-slate-200">{filteredCount}</strong> of <strong className="text-slate-800 dark:text-slate-200">{totalCount}</strong> employees
        </span>
        {hasActiveFilters && (
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Active filters applied
          </span>
        )}
      </div>
    </div>
  );
}
