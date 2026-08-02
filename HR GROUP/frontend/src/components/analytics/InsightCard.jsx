import React from 'react';
import { FiTrendingUp, FiAlertCircle, FiInfo } from 'react-icons/fi';

export default function InsightCard({ insight }) {
  if (!insight) return null;

  let icon = FiInfo;
  let color = 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 border-sky-200 dark:border-sky-800';

  if (insight.type === 'positive') {
    icon = FiTrendingUp;
    color = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-200 dark:border-emerald-800';
  } else if (insight.type === 'warning') {
    icon = FiAlertCircle;
    color = 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-200 dark:border-amber-800';
  }

  const IconComponent = icon;

  return (
    <div className={`p-4 rounded-2xl border shadow-sm space-y-2 text-xs ${color}`}>
      <div className="flex items-center justify-between font-bold">
        <span className="flex items-center gap-1.5">
          <IconComponent size={16} />
          {insight.title}
        </span>
        <span className="bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-full text-[10px] font-mono">
          {insight.metric}
        </span>
      </div>
      <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">{insight.message}</p>
    </div>
  );
}
