import React from 'react';
import SearchBar from '../SearchBar';
import Select from '../Select';
import { TRAINING_CATEGORIES, PRIORITY_LEVELS } from '../../config/trainingConstants';
import { DEPARTMENTS } from '../../mock/employees';
import { FiRotateCcw } from 'react-icons/fi';

export default function TrainingFilters({
  filters,
  onFilterChange,
  onReset,
  totalCount,
  filteredCount,
}) {
  const categoryOptions = TRAINING_CATEGORIES.map((c) => ({ label: c, value: c }));
  const departmentOptions = DEPARTMENTS.map((d) => ({ label: d, value: d }));
  const mandatoryOptions = [
    { label: 'Mandatory', value: 'Mandatory' },
    { label: 'Optional', value: 'Optional' },
  ];
  const priorityOptions = PRIORITY_LEVELS.map((p) => ({ label: p, value: p }));

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="lg:col-span-2">
          <SearchBar
            value={filters.searchTerm || ''}
            onChange={(val) => onFilterChange({ searchTerm: typeof val === 'string' ? val : val?.target?.value ?? '' })}
            placeholder="Search training name, code, instructor, department…"
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

        <Select
          value={filters.mandatory}
          onChange={(e) => onFilterChange({ mandatory: e.target.value })}
          options={mandatoryOptions}
          placeholder="Mandatory / Optional"
        />

        <Select
          value={filters.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value })}
          options={priorityOptions}
          placeholder="All Priorities"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-100 dark:border-slate-700/60 pt-3 text-xs text-slate-500 gap-2">
        <span>
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> training programs
        </span>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 font-semibold hover:underline cursor-pointer"
        >
          <FiRotateCcw size={12} /> Reset Filters
        </button>
      </div>
    </div>
  );
}
