import React from 'react';
import {
  ATTENDANCE_STATUS_LABELS,
  ATTENDANCE_STATUS_COLORS,
  ATTENDANCE_STATUS_ICONS,
} from '../utils/constants';
import { classNames } from '../utils/helpers';

const StatusBadge = ({ status, showIcon = true, className }) => {
  const normalized = status || '';
  const label = ATTENDANCE_STATUS_LABELS[normalized] || String(normalized || '').replace(/_/g, ' ');
  const icon = ATTENDANCE_STATUS_ICONS[normalized];

  return (
    <span
      className={classNames(
        'px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap inline-flex items-center gap-1.5',
        ATTENDANCE_STATUS_COLORS[normalized] || 'bg-gray-100 text-gray-700 border border-gray-200',
        className
      )}
    >
      {showIcon && icon && <span aria-hidden>{icon}</span>}
      {label || '—'}
    </span>
  );
};

export default StatusBadge;

