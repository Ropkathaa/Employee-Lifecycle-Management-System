import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { formatCurrency, calculateSalaryBreakdown } from '../../utils/salaryHelpers';
import { FiDollarSign, FiCheckCircle } from 'react-icons/fi';

export default function SalaryRevisionModal({ record, isOpen, onClose, onSubmitRevision }) {
  if (!record) return null;

  const [basicSalary, setBasicSalary] = useState(record.earnings?.basicSalary || 800000);
  const [hra, setHra] = useState(record.earnings?.hra || 320000);
  const [specialAllowance, setSpecialAllowance] = useState(record.earnings?.specialAllowance || 240000);
  const [bonus, setBonus] = useState(record.earnings?.bonus || 100000);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('Annual appraisal hike');

  useEffect(() => {
    if (record) {
      setBasicSalary(record.earnings?.basicSalary || 800000);
      setHra(record.earnings?.hra || 320000);
      setSpecialAllowance(record.earnings?.specialAllowance || 240000);
      setBonus(record.earnings?.bonus || 100000);
    }
  }, [record]);

  const previewBreakdown = calculateSalaryBreakdown({
    earnings: { basicSalary, hra, specialAllowance, bonus },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please enter revision reason.');
      return;
    }

    onSubmitRevision(record.employeeId, {
      effectiveDate,
      earnings: { basicSalary, hra, specialAllowance, bonus },
    }, reason);

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Revise Salary Package — ${record.employeeName} (${record.employeeId})`}>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 text-violet-800 dark:text-violet-300 font-semibold flex items-center justify-between">
          <span>This will create <strong>Version {(record.version || 1) + 1}</strong> without overwriting previous history.</span>
          <span className="font-mono font-bold">Current: v{record.version || 1}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-slate-500 font-semibold block mb-1">Annual Basic Salary (₹) *</label>
            <input
              type="number"
              value={basicSalary}
              onChange={(e) => setBasicSalary(Number(e.target.value))}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none font-bold"
            />
          </div>

          <div>
            <label className="text-slate-500 font-semibold block mb-1">Annual HRA (₹)</label>
            <input
              type="number"
              value={hra}
              onChange={(e) => setHra(Number(e.target.value))}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="text-slate-500 font-semibold block mb-1">Special Allowance (₹)</label>
            <input
              type="number"
              value={specialAllowance}
              onChange={(e) => setSpecialAllowance(Number(e.target.value))}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="text-slate-500 font-semibold block mb-1">Performance Bonus (₹)</label>
            <input
              type="number"
              value={bonus}
              onChange={(e) => setBonus(Number(e.target.value))}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
            />
          </div>
        </div>

        {/* Calculated Preview Strip */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
          <div><span className="text-slate-400">New Monthly Gross</span><p className="font-bold text-slate-900 dark:text-white">{formatCurrency(previewBreakdown.calculatedTotals.monthlyGross)}</p></div>
          <div><span className="text-slate-400">New Monthly Net</span><p className="font-bold text-teal-600 dark:text-teal-400">{formatCurrency(previewBreakdown.calculatedTotals.monthlyNet)}</p></div>
          <div><span className="text-slate-400">New Annual CTC</span><p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{formatCurrency(previewBreakdown.calculatedTotals.totalAnnualCTC)}</p></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-slate-500 font-semibold block mb-1">Effective Date *</label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none font-bold"
            />
          </div>

          <div>
            <label className="text-slate-500 font-semibold block mb-1">Revision Reason / Remarks *</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Annual Appraisal 2026 Hike..."
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none font-semibold"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-700 pt-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 font-semibold">
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
          >
            <FiCheckCircle size={15} /> Save Revision (Version {(record.version || 1) + 1})
          </button>
        </div>
      </form>
    </Modal>
  );
}
