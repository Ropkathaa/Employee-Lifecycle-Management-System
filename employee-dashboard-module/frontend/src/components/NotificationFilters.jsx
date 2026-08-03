import React from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import {
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_CATEGORY_LABELS,
  NOTIFICATION_PRIORITY,
  NOTIFICATION_PRIORITY_LABELS,
  NOTIFICATION_STATUS,
  NOTIFICATION_STATUS_LABELS,
} from '../utils/constants';

const NotificationFilters = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  priority,
  onPriorityChange,
  status,
  onStatusChange,
  sort,
  onSortToggle,
  onClear,
  hasActiveFilters,
}) => {
  return (
    <div className="card">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Category filter */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="input-field"
        >
          <option value="all">All Categories</option>
          {NOTIFICATION_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {NOTIFICATION_CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>

        {/* Priority filter */}
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="input-field"
        >
          <option value="all">All Priorities</option>
          {Object.values(NOTIFICATION_PRIORITY).map((p) => (
            <option key={p} value={p}>
              {NOTIFICATION_PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="input-field"
        >
          <option value="all">All Status</option>
          {Object.values(NOTIFICATION_STATUS).map((s) => (
            <option key={s} value={s}>
              {NOTIFICATION_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
        {/* Sort by latest */}
        <button
          onClick={onSortToggle}
          className="btn-secondary flex items-center justify-center gap-2 text-sm"
        >
          <FiFilter className="w-4 h-4" />
          {sort === 'latest' ? 'Latest First' : 'Oldest First'}
          {sort === 'latest' ? (
            <FiChevronDown className="w-4 h-4" />
          ) : (
            <FiChevronUp className="w-4 h-4" />
          )}
        </button>

        {/* Active filters indicator */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
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
    </div>
  );
};

export default NotificationFilters;

