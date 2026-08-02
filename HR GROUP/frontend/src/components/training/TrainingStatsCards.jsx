import React from 'react';
import { FiBookOpen, FiCheckCircle, FiClock, FiAlertTriangle, FiAward, FiShield, FiUsers } from 'react-icons/fi';

export default function TrainingStatsCards({ stats }) {
  const cards = [
    { title: 'Total Programs', value: stats.totalPrograms, subtitle: 'Created catalog', icon: FiBookOpen, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/30' },
    { title: 'Active Trainings', value: stats.activeTrainings, subtitle: 'Currently published', icon: FiUsers, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/30' },
    { title: 'Completed', value: stats.completedTrainings, subtitle: 'Employee completions', icon: FiCheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { title: 'Pending', value: stats.pendingTrainings, subtitle: 'In progress / assigned', icon: FiClock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { title: 'Overdue', value: stats.overdueTrainings, subtitle: 'Deadline passed', icon: FiAlertTriangle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30' },
    { title: 'Compliance Rate', value: `${stats.compliancePercentage}%`, subtitle: 'Mandatory completion', icon: FiShield, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/30' },
    { title: 'Certificates', value: stats.certificatesIssued, subtitle: 'Verified credentials', icon: FiAward, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/30' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg ${card.bg} ${card.color}`}>
                <Icon size={14} />
              </div>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white truncate">{card.value}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
