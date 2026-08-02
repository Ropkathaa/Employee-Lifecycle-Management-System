import React from 'react';
import { FiBarChart2, FiPieChart, FiTrendingUp } from 'react-icons/fi';

function BarChart({ data }) {
  const maxCount = Math.max(...data.map((d) => d.count));
  return (
    <div className="flex items-end gap-2 h-32 w-full">
      {data.map((item) => {
        const heightPercent = Math.round((item.count / maxCount) * 100);
        return (
          <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 group">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              {item.count}
            </span>
            <div
              className="w-full rounded-t-sm relative overflow-hidden bg-violet-100 dark:bg-violet-900/30 transition-all duration-500"
              style={{ height: `${heightPercent}%`, minHeight: '6px' }}
            >
              <div className="absolute inset-x-0 bottom-0 top-[40%] bg-violet-600 dark:bg-violet-500 rounded-t-sm group-hover:top-0 transition-all duration-300" />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">{item.month}</span>
          </div>
        );
      })}
    </div>
  );
}

function HorizontalBarChart({ data }) {
  const palette = [
    'bg-violet-500', 'bg-emerald-500', 'bg-amber-500',
    'bg-rose-500', 'bg-blue-500', 'bg-purple-400',
  ];
  return (
    <div className="space-y-3 w-full">
      {data.map((item, idx) => (
        <div key={item.department}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {item.department}
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {item.count}
              <span className="font-normal text-slate-400 ml-1">({item.percentage}%)</span>
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${palette[idx % palette.length]} transition-all duration-700`}
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DonutSegments({ data }) {
  const colorMap = {
    success: { fill: '#10b981', dot: 'bg-emerald-500', label: 'text-emerald-600 dark:text-emerald-400' },
    warning: { fill: '#f59e0b', dot: 'bg-amber-500', label: 'text-amber-600 dark:text-amber-400' },
    danger:  { fill: '#f43f5e', dot: 'bg-rose-500', label: 'text-rose-600 dark:text-rose-400' },
  };

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let cumulativeDash = 0;

  const segments = data.map((item) => {
    const dashArray = (item.value / 100) * circumference;
    const dashOffset = circumference - cumulativeDash;
    cumulativeDash += dashArray;
    return { ...item, dashArray, dashOffset, color: colorMap[item.color] || colorMap.success };
  });

  return (
    <div className="flex items-center gap-5 w-full">
      <div className="flex-shrink-0">
        <svg width="96" height="96" viewBox="0 0 100 100" className="-rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none"
            className="text-slate-100 dark:text-slate-700" stroke="currentColor" strokeWidth="12" />
          {segments.map((seg, idx) => (
            <circle
              key={idx} cx="50" cy="50" r={radius}
              fill="none"
              stroke={seg.color.fill}
              strokeWidth="12"
              strokeDasharray={`${seg.dashArray} ${circumference - seg.dashArray}`}
              strokeDashoffset={seg.dashOffset}
              className="transition-all duration-700"
            />
          ))}
        </svg>
      </div>
      <div className="space-y-2.5 flex-1">
        {data.map((item) => {
          const c = colorMap[item.color] || colorMap.success;
          return (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                <span className="text-xs text-slate-600 dark:text-slate-300">{item.label}</span>
              </div>
              <span className={`text-xs font-bold ${c.label}`}>{item.value}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardChart({ type = 'bar', title, subtitle, data = [], isLoading = false }) {
  const CHART_ICONS = { bar: FiBarChart2, 'horizontal-bar': FiPieChart, donut: FiTrendingUp };
  const ChartIcon = CHART_ICONS[type] || FiBarChart2;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <span className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
          <ChartIcon size={15} />
        </span>
      </div>
      {isLoading ? (
        <div className="animate-pulse space-y-2">
          {Array(5).fill(null).map((_, i) => (
            <div key={i} className="h-3 bg-slate-200 dark:bg-slate-700 rounded" style={{ width: `${50 + i * 10}%` }} />
          ))}
        </div>
      ) : (
        <>
          {type === 'bar' && <BarChart data={data} />}
          {type === 'horizontal-bar' && <HorizontalBarChart data={data} />}
          {type === 'donut' && <DonutSegments data={data} />}
        </>
      )}
    </div>
  );
}
