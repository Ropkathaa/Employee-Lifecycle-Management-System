import React, { useState } from 'react';
import Modal from '../Modal';
import { compareSalaryRevisions, formatCurrency } from '../../utils/salaryHelpers';
import { FiAlertCircle } from 'react-icons/fi';

export default function SalaryCompareModal({ record, isOpen, onClose }) {
  if (!record || !record.revisions || record.revisions.length === 0) return null;

  const revisionsList = record.revisions;
  const [revAIndex, setRevAIndex] = useState(revisionsList.length - 1);
  const [revBIndex, setRevBIndex] = useState(0);

  const revA = revisionsList[revAIndex] || revisionsList[0];
  const revB = revisionsList[revBIndex] || revisionsList[0];

  const diffItems = compareSalaryRevisions(revA, revB);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Salary Revision Comparison — ${record.employeeName} (${record.employeeId})`}>
      <div className="space-y-4 text-xs">
        {/* Revision Selector Bar */}
        <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
          <div>
            <label className="text-slate-500 font-semibold block mb-1">Baseline Revision (A)</label>
            <select
              value={revAIndex}
              onChange={(e) => setRevAIndex(Number(e.target.value))}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none font-bold"
            >
              {revisionsList.map((r, idx) => (
                <option key={r.version} value={idx}>
                  Version {r.version} ({r.effectiveDate}) — {r.reason}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-500 font-semibold block mb-1">Compared Revision (B)</label>
            <select
              value={revBIndex}
              onChange={(e) => setRevBIndex(Number(e.target.value))}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none font-bold"
            >
              {revisionsList.map((r, idx) => (
                <option key={r.version} value={idx}>
                  Version {r.version} ({r.effectiveDate}) — {r.reason}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Diff Comparison Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                <th className="py-2.5 px-3">Salary Component</th>
                <th className="py-2.5 px-3 bg-slate-50/50 dark:bg-slate-800/50">Version {revA.version}</th>
                <th className="py-2.5 px-3 bg-emerald-50/40 dark:bg-emerald-950/20">Version {revB.version}</th>
                <th className="py-2.5 px-3 text-center">Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {diffItems.map((item) => (
                <tr key={item.field} className={item.isDifferent ? 'bg-amber-50/50 dark:bg-amber-950/20 font-semibold' : ''}>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{item.label}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{item.valA}</td>
                  <td className="py-2.5 px-3 text-slate-900 dark:text-white font-bold">{item.valB}</td>
                  <td className="py-2.5 px-3 text-center">
                    {item.isDifferent ? (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        <FiAlertCircle size={12} /> Revised
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Unchanged</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
