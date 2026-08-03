import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import NotificationCard from './NotificationCard';
import EmptyState from './EmptyState';
import LoadingSkeleton from './LoadingSkeleton';
import { classNames } from '../utils/helpers';

const NotificationList = ({
  notifications = [],
  loading,
  pagination = {},
  currentPage,
  onPageChange,
  onMarkRead,
  onDelete,
  onViewDetails,
  hasActiveFilters,
  onClearFilters,
}) => {
  const { total = 0, totalPages = 1 } = pagination;

  // Loading state
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-4 flex items-center gap-4">
            <LoadingSkeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <LoadingSkeleton className="h-4 w-1/3" />
              <LoadingSkeleton className="h-3 w-2/3" />
              <LoadingSkeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (notifications.length === 0) {
    return (
      <div className="card">
        <EmptyState
          title={hasActiveFilters ? 'No notifications match your filters' : 'No notifications yet'}
          message={
            hasActiveFilters
              ? 'Try adjusting your search or filters.'
              : 'Notifications from different modules will appear here.'
          }
          action={
            hasActiveFilters ? (
              <button onClick={onClearFilters} className="btn-secondary text-sm">
                Clear filters
              </button>
            ) : null
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification._id}
            notification={notification}
            onMarkRead={() => onMarkRead(notification)}
            onDelete={() => onDelete(notification)}
            onViewDetails={() => onViewDetails(notification)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-1">
          <p className="text-sm text-gray-600">
            Showing {notifications.length === 0 ? 0 : (currentPage - 1) * pagination.limit + 1}–
            {Math.min(currentPage * pagination.limit, total)} of {total} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={classNames(
                  'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                  currentPage === page
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
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

export default NotificationList;

