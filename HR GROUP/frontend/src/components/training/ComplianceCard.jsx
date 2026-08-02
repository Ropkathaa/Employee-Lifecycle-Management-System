import React from 'react';
import TrainingProgressBar from './TrainingProgressBar';
import { FiShield, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export default function ComplianceCard({ compliance }) {
  if (!compliance) return null;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm text-xs">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
            <FiShield size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Organization Compliance Monitor</h3>
            <p className="text-[11px] text-slate-400">Mandatory training audit compliance rate</p>
          </div>
        </div>
        <span className="text-[11px] bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full font-extrabold border border-teal-200 dark:border-teal-800">
          {compliance.complianceRate}% Compliant
        </span>
      </div>

      <div className="space-y-2">
        <TrainingProgressBar progress={compliance.complianceRate} size="md" showLabel={true} />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center pt-2">
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <span className="text-slate-400 block mb-0.5">Completed</span>
          <strong className="text-emerald-700 dark:text-emerald-400 text-sm font-extrabold">{compliance.completedCount}</strong>
        </div>
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <span className="text-slate-400 block mb-0.5">Pending</span>
          <strong className="text-amber-700 dark:text-amber-400 text-sm font-extrabold">{compliance.pendingCount}</strong>
        </div>
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
          <span className="text-slate-400 block mb-0.5">Overdue</span>
          <strong className="text-rose-700 dark:text-rose-400 text-sm font-extrabold">{compliance.overdueCount}</strong>
        </div>
      </div>
    </div>
  );
}
