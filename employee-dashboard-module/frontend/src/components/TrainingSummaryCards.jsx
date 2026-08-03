import React from 'react';
import { FiBookOpen, FiClipboard, FiPlayCircle, FiCheckCircle, FiCalendar } from 'react-icons/fi';
import { TRAINING_STATUS } from '../utils/constants';
import { classNames } from '../utils/helpers';

const SUMMARY_CARDS = [
  {
    key: 'total',
    label: 'Total Assigned Trainings',
    icon: FiBookOpen,
    color: 'bg-blue-100 text-blue-600',
    valueColor: 'text-gray-900',
  },
  {
    key: 'registered',
    label: 'Registered Trainings',
    icon: FiClipboard,
    color: 'bg-sky-100 text-sky-600',
    valueColor: 'text-sky-600',
  },
  {
    key: 'inProgress',
    label: 'In Progress Trainings',
    icon: FiPlayCircle,
    color: 'bg-indigo-100 text-indigo-600',
    valueColor: 'text-indigo-600',
  },
  {
    key: 'completed',
    label: 'Completed Trainings',
    icon: FiCheckCircle,
    color: 'bg-green-100 text-green-600',
    valueColor: 'text-green-600',
  },
  {
    key: 'upcoming',
    label: 'Upcoming Trainings',
    icon: FiCalendar,
    color: 'bg-purple-100 text-purple-600',
    valueColor: 'text-purple-600',
  },
];

const TrainingSummaryCards = ({ trainings = [] }) => {
  const status = (t) => t.effectiveStatus || t.status;
  const stats = {
    total: trainings.length,
    registered: trainings.filter((t) => status(t) === TRAINING_STATUS.REGISTERED).length,
    inProgress: trainings.filter((t) => status(t) === TRAINING_STATUS.IN_PROGRESS).length,
    completed: trainings.filter((t) => status(t) === TRAINING_STATUS.COMPLETED).length,
    upcoming: trainings.filter(
      (t) =>
        status(t) === TRAINING_STATUS.PENDING &&
        (!t.dueDate || new Date(t.dueDate).getTime() > Date.now())
    ).length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {SUMMARY_CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.key} className="card flex items-center gap-4 p-5">
            <div className={classNames('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', card.color)}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold leading-none">{stats[card.key]}</p>
              <p className="text-xs text-gray-500 mt-1.5 leading-tight">{card.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrainingSummaryCards;

