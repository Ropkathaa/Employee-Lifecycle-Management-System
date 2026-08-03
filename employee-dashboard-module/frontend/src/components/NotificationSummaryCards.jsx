import React from 'react';
import { FiBell, FiMail, FiCheckCircle, FiAlertOctagon } from 'react-icons/fi';
import { NOTIFICATION_PRIORITY } from '../utils/constants';
import { classNames } from '../utils/helpers';

const SUMMARY_CARDS = [
  {
    key: 'total',
    label: 'Total Notifications',
    icon: FiBell,
    color: 'bg-blue-100 text-blue-600',
    valueColor: 'text-gray-900',
  },
  {
    key: 'unread',
    label: 'Unread Notifications',
    icon: FiMail,
    color: 'bg-amber-100 text-amber-600',
    valueColor: 'text-amber-600',
  },
  {
    key: 'read',
    label: 'Read Notifications',
    icon: FiCheckCircle,
    color: 'bg-green-100 text-green-600',
    valueColor: 'text-green-600',
  },
  {
    key: 'highPriority',
    label: 'High Priority',
    icon: FiAlertOctagon,
    color: 'bg-red-100 text-red-600',
    valueColor: 'text-red-600',
  },
];

const NotificationSummaryCards = ({ notifications = [] }) => {
  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => n.status === 'unread').length,
    read: notifications.filter((n) => n.status === 'read').length,
    highPriority: notifications.filter((n) => n.priority === NOTIFICATION_PRIORITY.HIGH).length,
  };

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {SUMMARY_CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.key} className="card flex items-center gap-4 p-5">
            <div className={classNames('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', card.color)}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className={classNames('text-2xl font-bold leading-none', card.valueColor)}>
                {stats[card.key]}
              </p>
              <p className="text-xs text-gray-500 mt-1.5 leading-tight">{card.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationSummaryCards;

