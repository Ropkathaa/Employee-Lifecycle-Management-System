import React from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { TRAINING_STATUS, TRAINING_STATUS_LABELS } from '../utils/constants';

const TrainingFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  categories = [],
  sortOrder,
  onSortToggle,
  onClear,
  hasActiveFilters,
}) => {
  return (
    <div className="card">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by course name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="input-field"
        >
          <option value="all">All Status</option>
          {Object.values(TRAINING_STATUS).map((s) => (
            <option key={s} value={s}>
              {TRAINING_STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        {/* Category filter */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="input-field"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Sort by due date */}
        <button
          onClick={onSortToggle}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <FiFilter className="w-4 h-4" />
          Due Date
          {sortOrder === 'asc' ? (
            <FiChevronUp className="w-4 h-4" />
          ) : (
            <FiChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Active filters indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
          <FiFilter className="w-3.5 h-3.5" />
          <span>Filters active</span>
          <button
            onClick={onClear}
            className="text-primary-600 hover:text-primary-700 underline ml-1"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default TrainingFilters;

