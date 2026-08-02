import React from 'react';
import { FiFileText, FiCheckCircle, FiClock, FiAlertTriangle, FiXCircle, FiHardDrive } from 'react-icons/fi';

export default function DocumentStatsCards({ stats }) {
  const cards = [
    { title: 'Total Documents', value: stats.total, subtitle: 'Across all employees', icon: FiFileText, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/30' },
    { title: 'Verified Documents', value: stats.verified, subtitle: 'Compliance passed', icon: FiCheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { title: 'Pending Verification', value: stats.pending, subtitle: 'Awaiting HR review', icon: FiClock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { title: 'Rejected', value: stats.rejected, subtitle: 'Requires re-upload', icon: FiXCircle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30' },
    { title: 'Expired / Expiring', value: `${stats.expired} (${stats.expiringSoon} soon)`, subtitle: 'Needs renewal', icon: FiAlertTriangle, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30' },
    { title: 'Storage Usage', value: stats.storageUsageFormatted || '0 B', subtitle: 'Mock limit: 50 GB', icon: FiHardDrive, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/30' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                <Icon size={16} />
              </div>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{card.value}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
