import React from 'react';

export default function TrainingProgressBar({ progress = 0, size = 'md', showLabel = true }) {
  const num = Math.min(100, Math.max(0, Number(progress) || 0));

  let color = 'bg-sky-500';
  if (num === 100) color = 'bg-emerald-500';
  else if (num > 50) color = 'bg-teal-500';
  else if (num < 20 && num > 0) color = 'bg-amber-500';

  const height = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className="w-full space-y-1">
      {showLabel && (
        <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <span>Progress</span>
          <span className="font-mono text-slate-800 dark:text-slate-200">{num}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${color} ${height} transition-all duration-500 rounded-full`}
          style={{ width: `${num}%` }}
        />
      </div>
    </div>
  );
}
