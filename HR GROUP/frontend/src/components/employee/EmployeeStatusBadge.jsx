import React from 'react';

const STATUS_STYLES = {
  Active: {
    badge: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
  },
  Probation: {
    badge: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
  Suspended: {
    badge: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    dot: 'bg-rose-500',
  },
  Resigned: {
    badge: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-400',
  },
};

/**
 * Reusable Status Badge component for employee states.
 */
export default function EmployeeStatusBadge({ status = 'Active', showDot = true, className = '' }) {
  const config = STATUS_STYLES[status] || STATUS_STYLES.Active;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.badge} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {status}
    </span>
  );
}
