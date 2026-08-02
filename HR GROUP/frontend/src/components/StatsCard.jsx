import React from 'react';

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trendValue,
  trendDirection = 'up', // 'up' | 'down' | 'neutral'
  trendLabel = 'vs last month',
  className = '',
}) {
  const isUp = trendDirection === 'up';
  const isDown = trendDirection === 'down';

  const trendColorClass = isUp
    ? 'text-emerald-600 dark:text-emerald-400'
    : isDown
    ? 'text-rose-600 dark:text-rose-400'
    : 'text-slate-500';

  return (
    <div className={`bg-surface border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between ${className}`}>
      {/* Top row: title & icon */}
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Icon size={18} />
          </div>
        )}
      </div>

      {/* Middle row: value */}
      <div className="mt-3">
        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
          {value}
        </span>
      </div>

      {/* Bottom row: trend details */}
      {(trendValue || trendLabel) && (
        <div className="flex items-center space-x-1 mt-4 text-xs font-normal">
          {trendValue && (
            <span className={`font-semibold ${trendColorClass}`}>
              {isUp ? '+' : ''}
              {trendValue}
            </span>
          )}
          {trendLabel && (
            <span className="text-slate-500 dark:text-slate-400">
              {trendLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
