import React from 'react';
import { formatCurrency } from '../../utils/salaryHelpers';
import { FiUsers, FiDollarSign, FiShield } from 'react-icons/fi';

export default function DepartmentCard({ department }) {
  if (!department) return null;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-2">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{department.department}</h4>
        <span className="bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 font-mono font-bold px-2 py-0.5 rounded-full text-[11px]">
          {department.headcount} Emp
        </span>
      </div>

      <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-slate-400">
            <FiDollarSign size={13} /> Avg Annual CTC:
          </span>
          <strong className="font-bold text-slate-900 dark:text-white">{formatCurrency(department.avgCTC)}</strong>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-slate-400">
            <FiShield size={13} /> Training Compliance:
          </span>
          <strong className="font-bold text-emerald-600 dark:text-emerald-400">{department.trainingCompliance}%</strong>
        </div>
      </div>
    </div>
  );
}
