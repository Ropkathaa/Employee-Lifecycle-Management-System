import React from 'react';

const STATUS_STYLES = {
  Published: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Completed: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  'In Progress': 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  Assigned: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 border-violet-200 dark:border-violet-800',
  Draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  Overdue: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  Critical: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-700 font-extrabold',
  Mandatory: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-bold',
};

export default function TrainingStatusBadge({ status, type }) {
  const key = type === 'mandatory' ? (status ? 'Mandatory' : 'Optional') : status;
  const style = STATUS_STYLES[key] || STATUS_STYLES.Published;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${style}`}>
      {key}
    </span>
  );
}
