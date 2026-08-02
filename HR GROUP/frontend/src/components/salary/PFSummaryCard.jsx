import React from 'react';
import { formatCurrency } from '../../utils/salaryHelpers';
import { PAYROLL_CONFIG } from '../../config/payrollConstants';
import { FiShield, FiCheckCircle } from 'react-icons/fi';

export default function PFSummaryCard({ record }) {
  if (!record) return null;

  const totals = record.calculatedTotals || {};
  const monthlyEmpPf = Math.round((totals.annualEmployeePf || 0) / 12);
  const monthlyEmprPf = Math.round((totals.annualEmployerPf || 0) / 12);
  const monthlyTotalPf = monthlyEmpPf + monthlyEmprPf;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm text-xs">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
            <FiShield size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Provident Fund (PF) Summary</h3>
            <p className="text-[11px] text-slate-400">Statutory EPFO 12% deduction & matching contribution</p>
          </div>
        </div>
        <span className="text-[11px] bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 px-2.5 py-1 rounded-full font-bold border border-teal-200 dark:border-teal-800">
          EPFO Compliant
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
          <span className="text-slate-400 block mb-0.5">Employee PF (Monthly)</span>
          <strong className="text-slate-900 dark:text-white font-bold">{formatCurrency(monthlyEmpPf)}</strong>
          <p className="text-[10px] text-slate-400 mt-0.5">12% of Basic</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
          <span className="text-slate-400 block mb-0.5">Employer PF (Monthly)</span>
          <strong className="text-slate-900 dark:text-white font-bold">{formatCurrency(monthlyEmprPf)}</strong>
          <p className="text-[10px] text-slate-400 mt-0.5">12% of Basic</p>
        </div>

        <div className="p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60">
          <span className="text-slate-500 block mb-0.5">Total Monthly PF</span>
          <strong className="text-teal-700 dark:text-teal-400 font-extrabold text-sm">{formatCurrency(monthlyTotalPf)}</strong>
          <p className="text-[10px] text-slate-500 mt-0.5">Combined payout</p>
        </div>

        <div className="p-3 rounded-xl bg-violet-50/60 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/60">
          <span className="text-slate-500 block mb-0.5">Annual Contribution</span>
          <strong className="text-violet-700 dark:text-violet-400 font-extrabold text-sm">{formatCurrency(totals.totalPfContribution)}</strong>
          <p className="text-[10px] text-slate-500 mt-0.5">Accumulated annual</p>
        </div>
      </div>
    </div>
  );
}
