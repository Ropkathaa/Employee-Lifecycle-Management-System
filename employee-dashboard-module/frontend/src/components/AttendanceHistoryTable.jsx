import React from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiLogIn,
  FiLogOut,
  FiClock,
  FiInfo,
} from 'react-icons/fi';
import { FORMAT_DATE, FORMAT_TIME, FORMAT_HOURS } from '../utils/constants';
import { classNames } from '../utils/helpers';
import StatusBadge from './StatusBadge';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';

const AttendanceHistoryTable = ({
  data = [],
  loading = false,
  pagination = {},
  onPageChange,
  hasActiveFilters,
  onClearFilters,
}) => {
  const { page = 1, total = 0, limit = 10, totalPages = 1 } = pagination;

  const columns = ['Date', 'Check In', 'Check Out', 'Working Hours', 'Status', 'Late', 'Remarks'];

  const renderLate = (record) => {
    if (!record.checkIn) return <span className="text-gray-400">—</span>;
    return (
      <span
        className={classNames(
          'px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap',
          record.lateEntry
            ? 'bg-orange-100 text-orange-700 border border-orange-200'
            : 'bg-green-100 text-green-700 border border-green-200'
        )}
      >
        {record.lateEntry ? 'Yes' : 'No'}
      </span>
    );
  };

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10">
                  <div className="space-y-3">
                    <LoadingSkeleton className="h-8 w-full" />
                    <LoadingSkeleton className="h-8 w-full" />
                    <LoadingSkeleton className="h-8 w-full" />
                    <LoadingSkeleton className="h-8 w-full" />
                    <LoadingSkeleton className="h-8 w-full" />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState
                    title="No attendance records found"
                    message={
                      hasActiveFilters
                        ? 'Try adjusting your search or filters.'
                        : 'Attendance records will appear here after you check in.'
                    }
                    action={
                      hasActiveFilters ? (
                        <button onClick={onClearFilters} className="btn-secondary text-sm">
                          Clear filters
                        </button>
                      ) : null
                    }
                  />
                </td>
              </tr>
            ) : (
              data.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {FORMAT_DATE(record.date)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                      <FiLogIn className="w-3.5 h-3.5 text-green-500" />
                      {FORMAT_TIME(record.checkIn)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                      <FiLogOut className="w-3.5 h-3.5 text-red-500" />
                      {FORMAT_TIME(record.checkOut)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                      <FiClock className="w-3.5 h-3.5 text-indigo-500" />
                      {FORMAT_HOURS(record.workingHours)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusBadge status={record.status} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{renderLate(record)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                      <FiInfo className="w-3.5 h-3.5 text-gray-400" />
                      {record.remarks || '—'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing {total === 0 ? 0 : (page - 1) * limit + 1}–
            {Math.min(page * limit, total)} of {total} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={classNames(
                  'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                  page === p
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistoryTable;

