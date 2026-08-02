import React from 'react';

const STATUS_STYLES = {
  Draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  'Pending Approval': 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  Approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  Sent: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 border-violet-200 dark:border-violet-800',
  'Negotiation Requested': 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-bold animate-pulse',
  'Under Negotiation': 'bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300 border-violet-300 dark:border-violet-700 font-bold',
  'Negotiation Completed': 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-300 dark:border-teal-700 font-bold',
  'Revised Offer Sent': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 font-bold',
  Accepted: 'bg-emerald-600 text-white dark:bg-emerald-600 dark:text-white border-transparent font-bold shadow-sm',
  Declined: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  Expired: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700 opacity-80',
};

export default function OfferStatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Draft;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${style}`}>
      {status}
    </span>
  );
}
