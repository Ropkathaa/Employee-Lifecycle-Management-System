import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiChevronRight, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { getTimeAgo, NOTIFICATION_CATEGORY_COLORS, NOTIFICATION_PRIORITY_COLORS } from '../utils/constants';
import EmptyState from './EmptyState';

const getCategoryIcon = (category) => {
  const iconMap = {
    document: '📄',
    training: '🎓',
    attendance: '⏰',
    leave: '🏖️',
    profile: '👤',
    hr: '🏢',
    company: '🏢',
    performance: '📊',
    general: '📋',
  };
  return iconMap[category] || '📋';
};

const getPriorityIcon = (priority) => {
  if (priority === 'high') return FiAlertCircle;
  if (priority === 'medium') return FiAlertTriangle;
  return FiInfo;
};

const getPriorityColor = (priority) => {
  const colors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-orange-100 text-orange-700',
    low: 'bg-blue-100 text-blue-700',
  };
  return colors[priority] || 'bg-gray-100 text-gray-700';
};

const RecentNotifications = ({ notifications = [], unreadCount = 0 }) => {
  const navigate = useNavigate();

  return (
    <div className="card overflow-hidden p-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-white">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold bg-white/20 text-white rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <FiBell className="w-5 h-5 text-primary-100" />
      </div>

      <div className="p-2">
        {notifications.length === 0 ? (
          <EmptyState
            title="No notifications yet"
            message="You're all caught up! New notifications will appear here."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => {
              const isUnread = notification.status === 'unread';
              const PriorityIcon = getPriorityIcon(notification.priority);

              return (
                <div
                  key={notification._id}
                  className={`flex items-start gap-3 px-4 py-3.5 transition-colors duration-200 cursor-pointer hover:bg-gray-50 rounded-lg ${
                    isUnread ? 'bg-primary-50/50' : ''
                  }`}
                  onClick={() => {
                    if (notification.actionUrl) {
                      navigate(notification.actionUrl);
                    }
                  }}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                    {getCategoryIcon(notification.category)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm ${
                          isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                        }`}
                      >
                        {notification.title}
                      </p>
                      <span
                        className={`flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 ${getPriorityColor(
                          notification.priority
                        )}`}
                      >
                        <PriorityIcon className="w-3 h-3" />
                        <span className="capitalize">{notification.priority}</span>
                      </span>
                    </div>
                    {notification.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {notification.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1.5">
                      {getTimeAgo(notification.createdAt)}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {isUnread && (
                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary-500" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* View All Link */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100">
          <button
            onClick={() => navigate('/notifications')}
            className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
          >
            View All Notifications
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentNotifications;
