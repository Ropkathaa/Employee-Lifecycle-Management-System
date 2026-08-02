import React from 'react';
import { useNavigate } from 'react-router-dom';
import SalaryBadge from './SalaryBadge';
import { formatCurrency } from '../../utils/salaryHelpers';
import { FiDollarSign, FiEye, FiEdit3, FiCheckSquare } from 'react-icons/fi';

export default function SalaryTable({
  records,
  page = 1,
  totalPages = 1,
  onPageChange,
  onOpenReviseModal,
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-xs text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase">
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Department & Role</th>
              <th className="py-3 px-4">Monthly Gross</th>
              <th className="py-3 px-4">Employee PF</th>
              <th className="py-3 px-4">Employer PF</th>
              <th className="py-3 px-4">Net Monthly</th>
              <th className="py-3 px-4">Annual CTC</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {records.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-slate-400">
                  <FiCheckSquare size={32} className="mx-auto mb-2 opacity-50" />
                  No salary records match current filter parameters.
                </td>
              </tr>
            ) : (
              records.map((rec) => {
                const totals = rec.calculatedTotals || {};
                return (
                  <tr key={rec.employeeId} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                          <FiDollarSign size={18} />
                        </div>
                        <div>
                          <button
                            onClick={() => navigate(`/salary/${rec.employeeId}`)}
                            className="font-bold text-slate-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 truncate block text-left"
                          >
                            {rec.employeeName}
                          </button>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {rec.employeeId} · v{rec.version || 1}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{rec.designation}</p>
                      <span className="text-[11px] text-slate-400">{rec.department}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(totals.monthlyGross)}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {formatCurrency(totals.annualEmployeePf / 12)}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {formatCurrency(totals.annualEmployerPf / 12)}
                    </td>
                    <td className="py-3 px-4 font-bold text-teal-600 dark:text-teal-400">
                      {formatCurrency(totals.monthlyNet)}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(totals.totalAnnualCTC)}
                    </td>
                    <td className="py-3 px-4">
                      <SalaryBadge status={rec.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/salary/${rec.employeeId}`)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                          title="View Full Salary Details"
                        >
                          <FiEye size={14} />
                        </button>
                        <button
                          onClick={() => onOpenReviseModal(rec)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-violet-600 dark:text-violet-400"
                          title="Revise Salary Package"
                        >
                          <FiEdit3 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
        <span>Page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
