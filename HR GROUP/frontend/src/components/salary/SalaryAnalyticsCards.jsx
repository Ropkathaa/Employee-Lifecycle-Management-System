import React from 'react';
import { formatCurrency } from '../../utils/salaryHelpers';
import { FiPieChart } from 'react-icons/fi';

export default function SalaryAnalyticsCards({ analytics = [] }) {
  if (!analytics || analytics.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm text-xs">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400">
            <FiPieChart size={18} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">Department-Wise Salary Distribution Analytics</h3>
        </div>
        <span className="text-[11px] text-slate-400">Headcount & Average Annual CTC</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analytics.map((item) => (
          <div key={item.department} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
              <span>{item.department}</span>
              <span className="text-[11px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-mono">
                {item.count} Emp
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Total Dept CTC: <strong>{formatCurrency(item.totalCTC)}</strong></p>
            <p className="text-xs font-extrabold text-violet-600 dark:text-violet-400 pt-1">
              Avg CTC: {formatCurrency(item.avgCTC)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
