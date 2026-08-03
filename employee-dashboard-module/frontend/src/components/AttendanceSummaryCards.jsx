import React from 'react';
import {
  FiCheckCircle,
  FiXCircle,
  FiSun,
  FiAlertTriangle,
  FiClock,
  FiPercent,
} from 'react-icons/fi';
import { classNames } from '../utils/helpers';

const SUMMARY_CARDS = [
  {
    key: 'presentDays',
    label: 'Present Days',
    icon: FiCheckCircle,
    color: 'bg-green-100 text-green-600',
    valueColor: 'text-green-600',
  },
  {
    key: 'absentDays',
    label: 'Absent Days',
    icon: FiXCircle,
    color: 'bg-red-100 text-red-600',
    valueColor: 'text-red-600',
  },
  {
    key: 'halfDays',
    label: 'Half Days',
    icon: FiSun,
    color: 'bg-yellow-100 text-yellow-600',
    valueColor: 'text-yellow-600',
  },
  {
    key: 'lateEntries',
    label: 'Late Entries',
    icon: FiAlertTriangle,
    color: 'bg-orange-100 text-orange-600',
    valueColor: 'text-orange-600',
  },
  {
    key: 'totalWorkingHours',
    label: 'Total Working Hours',
    icon: FiClock,
    color: 'bg-indigo-100 text-indigo-600',
    valueColor: 'text-indigo-600',
    format: (value) => {
      const totalMinutes = Math.round((value || 0) * 60);
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return h > 0 ? `${h}h ${m}m` : `${m}m`;
    },
  },
  {
    key: 'attendancePercentage',
    label: 'Attendance %',
    icon: FiPercent,
    color: 'bg-purple-100 text-purple-600',
    valueColor: 'text-purple-600',
    format: (value) => `${(value || 0).toFixed(1)}%`,
  },
];

const AttendanceSummaryCards = ({ summary = {}, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-5 animate-pulse">
            <div className="w-11 h-11 rounded-xl bg-gray-200" />
            <div className="mt-3 h-6 w-12 bg-gray-200 rounded" />
            <div className="mt-2 h-3 w-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {SUMMARY_CARDS.map((card) => {
        const Icon = card.icon;
        const raw = summary[card.key] ?? 0;
        const value = card.format ? card.format(raw) : raw;
        return (
          <div key={card.key} className="card flex items-center gap-4 p-5 animate-fade-slide">
            <div
              className={classNames(
                'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
                card.color
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className={classNames('text-2xl font-bold leading-none', card.valueColor)}>
                {value}
              </p>
              <p className="text-xs text-gray-500 mt-1.5 leading-tight">{card.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttendanceSummaryCards;

