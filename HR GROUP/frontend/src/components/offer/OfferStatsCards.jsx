import React from 'react';
import { FiFileText, FiClock, FiCheckCircle, FiXCircle, FiSend, FiAlertCircle } from 'react-icons/fi';

export default function OfferStatsCards({ stats }) {
  const cards = [
    { title: 'Offers Generated', value: stats.total, subtitle: 'Total created packets', icon: FiFileText, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/30' },
    { title: 'Pending Approval', value: stats.pending, subtitle: 'Awaiting HR Director', icon: FiClock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { title: 'Approved', value: stats.approved, subtitle: 'Ready for dispatch', icon: FiCheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { title: 'Sent to Candidate', value: stats.sent, subtitle: 'Out for signature', icon: FiSend, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/30' },
    { title: 'Accepted', value: stats.accepted, subtitle: 'Joined / Onboarding', icon: FiCheckCircle, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/30' },
    { title: 'Expired / Declined', value: `${stats.expired + stats.declined}`, subtitle: 'Closed offers', icon: FiAlertCircle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30' },
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
