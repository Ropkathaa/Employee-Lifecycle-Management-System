import React from 'react';
import { FiSearch, FiFilter, FiCalendar } from 'react-icons/fi';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'present', label: 'Full Day' },
  { value: 'half_day', label: 'Half Day' },
  { value: 'absent', label: 'Absent' },
  { value: 'late', label: 'Late Entry' },
  { value: 'leave', label: 'Leave' },
];

const MONTH_OPTIONS = [
  { value: 'all', label: 'All Months' },
];

// Generate last 6 months for the dropdown
const generateMonths = () => {
  const options = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    options.push({ value, label });
  }
  return options;
};

const AttendanceFilters = ({
  search,
  onSearchChange,
  month,
  onMonthChange,
  status,
  onStatusChange,
  onClear,
  hasActiveFilters,
}) => {
  const months = [...MONTH_OPTIONS, ...generateMonths()];

  return (
    <div className="card">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by date or remarks..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Month filter */}
        <div className="relative">
          <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
            className="input-field pl-10"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="input-field"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Active filters indicator */}
        <div className="flex items-end">
          {hasActiveFilters ? (
            <button
              onClick={onClear}
              className="btn-secondary flex items-center justify-center gap-2 w-full"
            >
              <FiFilter className="w-4 h-4" />
              Clear Filters
            </button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-400 w-full justify-center py-2">
              <FiFilter className="w-4 h-4" />
              <span>No active filters</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceFilters;

