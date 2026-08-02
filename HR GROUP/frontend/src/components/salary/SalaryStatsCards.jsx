import React from 'react';
import { formatCurrency } from '../../utils/salaryHelpers';
import { FiUsers, FiDollarSign, FiTrendingUp, FiTrendingDown, FiPieChart, FiShield } from 'react-icons/fi';

export default function SalaryStatsCards({ stats }) {
  const cards = [
    { title: 'Total Salaried', value: stats.totalEmployees, subtitle: 'Across all departments', icon: FiUsers, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/30' },
    { title: 'Average CTC', value: formatCurrency(stats.avgCTC), subtitle: 'Annualized average', icon: FiDollarSign, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { title: 'Highest CTC', value: formatCurrency(stats.highestCTC), subtitle: 'Senior leadership band', icon: FiTrendingUp, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/30' },
    { title: 'Lowest CTC', value: formatCurrency(stats.lowestCTC), subtitle: 'Entry grade band', icon: FiTrendingDown, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { title: 'Monthly Payroll', value: formatCurrency(stats.monthlyPayrollEstimate), subtitle: 'Gross monthly payout', icon: FiPieChart, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/30' },
    { title: 'Total PF Contribution', value: formatCurrency(stats.totalEmployerPF + stats.totalEmployeePF), subtitle: `Employer + Employee (12%)`, icon: FiShield, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/30' },
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
              <p className="text-xl font-bold text-slate-900 dark:text-white truncate">{card.value}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
