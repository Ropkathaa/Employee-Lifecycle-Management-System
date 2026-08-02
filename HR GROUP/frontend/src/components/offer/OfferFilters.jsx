import React from 'react';
import SearchBar from '../SearchBar';
import Select from '../Select';
import { OFFER_STATUSES } from '../../mock/offers';
import { DEPARTMENTS } from '../../mock/employees';
import { FiRotateCcw } from 'react-icons/fi';

export default function OfferFilters({
  filters,
  onFilterChange,
  onReset,
  totalCount,
  filteredCount,
}) {
  const departmentOptions = DEPARTMENTS.map((d) => ({ label: d, value: d }));
  const statusOptions = OFFER_STATUSES.map((s) => ({ label: s, value: s }));
  const templateOptions = [
    { label: 'Full-Time', value: 'Full-Time' },
    { label: 'Internship', value: 'Internship' },
    { label: 'Contract', value: 'Contract' },
    { label: 'Remote', value: 'Remote' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="lg:col-span-2">
          <SearchBar
            value={filters.searchTerm || ''}
            onChange={(val) => onFilterChange({ searchTerm: typeof val === 'string' ? val : val?.target?.value ?? '' })}
            placeholder="Search by candidate name, offer ID, designation…"
          />
        </div>

        <Select
          value={filters.department}
          onChange={(e) => onFilterChange({ department: e.target.value })}
          options={departmentOptions}
          placeholder="All Departments"
        />

        <Select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          options={statusOptions}
          placeholder="All Statuses"
        />

        <Select
          value={filters.templateType}
          onChange={(e) => onFilterChange({ templateType: e.target.value })}
          options={templateOptions}
          placeholder="All Employment Types"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-100 dark:border-slate-700/60 pt-3 text-xs text-slate-500 gap-2">
        <span>
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> offer packets
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
