import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiTrendingDown, FiArrowRight } from 'react-icons/fi';

export default function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendDirection = 'up',
  icon: Icon,
  color = 'text-violet-600 dark:text-violet-400',
  bg = 'bg-violet-50 dark:bg-violet-950/30',
  targetPath,
}) {
  const navigate = useNavigate();

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl ${bg} ${color}`}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white truncate">{value}</h3>
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                trendDirection === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trendDirection === 'up' ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
              {trend}
            </span>
          )}
        </div>
        {subtitle && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate">{subtitle}</p>}
      </div>

      {targetPath && (
        <button
          onClick={() => navigate(targetPath)}
          className="flex items-center gap-1 text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:underline pt-1 cursor-pointer border-t border-slate-100 dark:border-slate-700/60"
        >
          <span>View Details</span> <FiArrowRight size={12} />
        </button>
      )}
    </div>
  );
}
