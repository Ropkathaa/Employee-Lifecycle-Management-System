import React from 'react';
import SearchBar from '../SearchBar';
import Select from '../Select';
import { REPORT_CATEGORIES } from '../../config/reportTemplates';
import { DEPARTMENTS } from '../../mock/employees';
import { FiRotateCcw } from 'react-icons/fi';

export default function AnalyticsFilters({
  filters,
  onFilterChange,
  onReset,
  totalCount,
  filteredCount,
}) {
  const categoryOptions = REPORT_CATEGORIES.map((c) => ({ label: c, value: c }));
  const departmentOptions = DEPARTMENTS.map((d) => ({ label: d, value: d }));

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-4 shadow-sm text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="lg:col-span-2">
          <SearchBar
            value={filters.searchTerm || ''}
            onChange={(val) => onFilterChange({ searchTerm: typeof val === 'string' ? val : val?.target?.value ?? '' })}
            placeholder="Search report templates, descriptions, or metrics…"
          />
        </div>

        <Select
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          options={categoryOptions}
          placeholder="All Categories"
        />

        <Select
          value={filters.department}
          onChange={(e) => onFilterChange({ department: e.target.value })}
          options={departmentOptions}
          placeholder="All Departments"
        />
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 pt-3 text-slate-500">
        <span>Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> report templates</span>
        <button onClick={onReset} className="flex items-center gap-1 text-violet-600 font-semibold hover:underline">
          <FiRotateCcw size={12} /> Reset Filters
        </button>
      </div>
    </div>
  );
}
