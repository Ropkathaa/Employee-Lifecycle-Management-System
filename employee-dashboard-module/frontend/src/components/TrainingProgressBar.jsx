import React from 'react';
import { classNames } from '../utils/helpers';
import { TRAINING_STATUS } from '../utils/constants';

const getColor = (progress, status) => {
  if (status === TRAINING_STATUS.COMPLETED || progress >= 100) return 'bg-green-500';
  if (progress >= 75) return 'bg-emerald-500';
  if (progress >= 50) return 'bg-blue-500';
  if (progress >= 25) return 'bg-indigo-500';
  return 'bg-yellow-500';
};

const TrainingProgressBar = ({ progress = 0, status, showLabel = true, className }) => {
  const value = Math.max(0, Math.min(100, Number(progress) || 0));
  const completed = status === TRAINING_STATUS.COMPLETED || value >= 100;

  return (
    <div className={classNames('w-full min-w-[120px]', className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-500">Progress</span>
          <span className={classNames('text-xs font-semibold', completed ? 'text-green-600' : 'text-gray-700')}>
            {completed ? '100%' : `${value}%`}
          </span>
        </div>
      )}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={classNames(
            'h-full rounded-full transition-all duration-500',
            getColor(value, status)
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default TrainingProgressBar;

