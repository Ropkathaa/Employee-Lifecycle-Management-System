import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiX,
  FiFileText,
  FiBookOpen,
  FiCalendar,
  FiClipboard,
  FiUser,
  FiBriefcase,
  FiUsers,
  FiTrendingUp,
  FiBell,
  FiClock,
  FiArrowRight,
  FiLayers,
} from 'react-icons/fi';
import {
  NOTIFICATION_CATEGORY_LABELS,
  NOTIFICATION_CATEGORY_COLORS,
  NOTIFICATION_PRIORITY_LABELS,
  NOTIFICATION_PRIORITY_COLORS,
  NOTIFICATION_STATUS_LABELS,
  NOTIFICATION_STATUS_COLORS,
  FORMAT_DATETIME,
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

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm text-gray-800 font-medium break-words">{value || '—'}</p>
    </div>
  </div>
);

const NotificationDetailsModal = ({ notification, onClose, onAction }) => {
  const navigate = useNavigate();

  if (!notification) return null;

  const Icon = CATEGORY_ICONS[notification.category] || FiBell;
  const iconColor = CATEGORY_ICON_COLORS[notification.category] || CATEGORY_ICON_COLORS.general;

  const handleAction = () => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      if (onAction) onAction(notification);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-modal-overlay"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[92vh] overflow-hidden animate-modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className={classNames('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', iconColor)}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{notification.title}</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {NOTIFICATION_CATEGORY_LABELS[notification.category] || 'General'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/70 transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={classNames('px-2.5 py-1 rounded-full text-xs font-medium', NOTIFICATION_CATEGORY_COLORS[notification.category] || NOTIFICATION_CATEGORY_COLORS.general)}>
              {NOTIFICATION_CATEGORY_LABELS[notification.category] || 'General'}
            </span>
            <span className={classNames('px-2.5 py-1 rounded-full text-xs font-medium', NOTIFICATION_PRIORITY_COLORS[notification.priority])}>
              {NOTIFICATION_PRIORITY_LABELS[notification.priority] || notification.priority}
            </span>
            <span className={classNames('px-2.5 py-1 rounded-full text-xs font-medium', NOTIFICATION_STATUS_COLORS[notification.status])}>
              {NOTIFICATION_STATUS_LABELS[notification.status] || notification.status}
            </span>
          </div>

          {/* Complete message */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Message
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
              {notification.description || 'No additional message.'}
            </p>
          </div>

          {/* Key details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailItem icon={FiClock} label="Created" value={FORMAT_DATETIME(notification.createdAt)} />
              <DetailItem icon={FiLayers} label="Related Module" value={notification.relatedModule || NOTIFICATION_CATEGORY_LABELS[notification.category] || 'General'} />
              <DetailItem icon={FiBell} label="Priority" value={NOTIFICATION_PRIORITY_LABELS[notification.priority]} />
              <DetailItem icon={FiBell} label="Status" value={NOTIFICATION_STATUS_LABELS[notification.status]} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/60 flex items-center justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
          {notification.actionUrl && (
            <button onClick={handleAction} className="btn-primary flex items-center gap-2">
              {notification.actionLabel || 'Open Module'}
              <FiArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailsModal;

