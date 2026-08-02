import React from 'react';

const STATUS_STYLES = {
  Verified: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  Rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  Expired: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  'Needs Update': 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 border-violet-200 dark:border-violet-800',
};

export default function VerificationBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${style}`}>
      {status}
    </span>
  );
}
