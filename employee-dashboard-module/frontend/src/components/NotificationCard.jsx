import React from 'react';
import {
  FiFileText,
  FiBookOpen,
  FiCalendar,
  FiClipboard,
  FiUser,
  FiBriefcase,
  FiUsers,
  FiTrendingUp,
  FiBell,
  FiCheck,
  FiTrash2,
  FiEye,
  FiClock,
} from 'react-icons/fi';
import {
  NOTIFICATION_CATEGORY_LABELS,
  NOTIFICATION_CATEGORY_COLORS,
  NOTIFICATION_PRIORITY_LABELS,
  NOTIFICATION_PRIORITY_COLORS,
  NOTIFICATION_STATUS_LABELS,
  NOTIFICATION_STATUS_COLORS,
  getTimeAgo,
} from '../utils/constants';
import { classNames } from '../utils/helpers';

const CATEGORY_ICONS = {
  document: FiFileText,
  training: FiBookOpen,
  attendance: FiCalendar,
  leave: FiClipboard,
  profile: FiUser,
  hr: FiBriefcase,
  company: FiUsers,
  performance: FiTrendingUp,
  general: FiBell,
};

const CATEGORY_ICON_COLORS = {
  document: 'bg-blue-100 text-blue-600',
  training: 'bg-indigo-100 text-indigo-600',
  attendance: 'bg-amber-100 text-amber-600',
  leave: 'bg-green-100 text-green-600',
  profile: 'bg-purple-100 text-purple-600',
  hr: 'bg-pink-100 text-pink-600',
  company: 'bg-cyan-100 text-cyan-600',
  performance: 'bg-orange-100 text-orange-600',
  general: 'bg-gray-100 text-gray-600',
};

const NotificationCard = ({
  notification,
  onMarkRead,
  onDelete,
  onViewDetails,
}) => {
  const Icon = CATEGORY_ICONS[notification.category] || FiBell;
  const iconColor = CATEGORY_ICON_COLORS[notification.category] || CATEGORY_ICON_COLORS.general;
  const isUnread = notification.status === 'unread';

  return (
    <div
      className={classNames(
        'group card flex items-start gap-4 p-4 transition-all duration-200 hover:shadow-md',
        isUnread
          ? 'bg-blue-50/60 border-blue-200 ring-1 ring-blue-100'
          : 'bg-white opacity-90'
      )}
    >
      {/* Icon */}
      <div className={classNames('p-2.5 rounded-xl flex-shrink-0', iconColor)}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h4 className={classNames('text-sm font-semibold', isUnread ? 'text-gray-900' : 'text-gray-700')}>
            {notification.title}
          </h4>
          {isUnread && (
            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
          )}
        </div>

        <p className={classNames('text-sm line-clamp-2', isUnread ? 'text-gray-600' : 'text-gray-500')}>
          {notification.description}
        </p>

        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2 mt-2.5">
          <span className={classNames('px-2.5 py-0.5 rounded-full text-[11px] font-medium', NOTIFICATION_CATEGORY_COLORS[notification.category] || NOTIFICATION_CATEGORY_COLORS.general)}>
            {NOTIFICATION_CATEGORY_LABELS[notification.category] || 'General'}
          </span>
          <span className={classNames('px-2.5 py-0.5 rounded-full text-[11px] font-medium', NOTIFICATION_PRIORITY_COLORS[notification.priority])}>
            {NOTIFICATION_PRIORITY_LABELS[notification.priority] || notification.priority}
          </span>
          <span className={classNames('px-2.5 py-0.5 rounded-full text-[11px] font-medium', NOTIFICATION_STATUS_COLORS[notification.status])}>
            {NOTIFICATION_STATUS_LABELS[notification.status] || notification.status}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-gray-400 ml-auto">
            <FiClock className="w-3 h-3" />
            {getTimeAgo(notification.createdAt)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onViewDetails}
          title="View Details"
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary-600 transition-colors"
        >
          <FiEye className="w-4 h-4" />
        </button>
        {isUnread && (
          <button
            onClick={onMarkRead}
            title="Mark as read"
            className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
          >
            <FiCheck className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onDelete}
          title="Delete"
          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;

