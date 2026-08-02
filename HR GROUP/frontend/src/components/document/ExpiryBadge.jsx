import React from 'react';
import { calculateExpiry } from '../../utils/documentHelpers';

export default function ExpiryBadge({ expiryDate }) {
  const { status, daysRemaining } = calculateExpiry(expiryDate);

  if (status === 'N/A') {
    return <span className="text-slate-400 text-xs">—</span>;
  }

  let colorStyle = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
  if (status === 'Valid') {
    colorStyle = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400';
  } else if (status === 'Expiring Soon') {
    colorStyle = 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 animate-pulse';
  } else if (status === 'Expired') {
    colorStyle = 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400';
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border border-transparent ${colorStyle}`}>
      <span>{status}</span>
      {daysRemaining !== null && (
        <span className="opacity-75 font-mono text-[10px]">
          ({daysRemaining > 0 ? `${daysRemaining}d left` : `${Math.abs(daysRemaining)}d ago`})
        </span>
      )}
    </span>
  );
}
