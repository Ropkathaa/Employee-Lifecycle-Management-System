import React from 'react';
import { TRAINING_STATUS, TRAINING_STATUS_LABELS, TRAINING_STATUS_COLORS } from '../utils/constants';
import { classNames } from '../utils/helpers';

const TRAINING_STATUS_ICONS = {
  [TRAINING_STATUS.PENDING]: '⏳',
  [TRAINING_STATUS.REGISTERED]: '📋',
  [TRAINING_STATUS.IN_PROGRESS]: '🚀',
  [TRAINING_STATUS.COMPLETED]: '✅',
  [TRAINING_STATUS.OVERDUE]: '⚠️',
};

const TrainingStatusBadge = ({ status, className }) => {
  const normalized = TRAINING_STATUS[status] || status;
  const label = TRAINING_STATUS_LABELS[normalized] || String(normalized || '').replace(/_/g, ' ');

  return (
    <span
      className={classNames(
        'px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap inline-flex items-center gap-1.5',
        TRAINING_STATUS_COLORS[normalized] || 'bg-gray-100 text-gray-700 border border-gray-200',
        className
      )}
    >
      <span aria-hidden>{TRAINING_STATUS_ICONS[normalized]}</span>
      {label}
    </span>
  );
};

export default TrainingStatusBadge;

