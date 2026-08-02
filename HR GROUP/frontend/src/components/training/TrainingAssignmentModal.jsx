import React, { useState } from 'react';
import Modal from '../Modal';
import { DEPARTMENTS } from '../../mock/employees';
import { FiUserPlus, FiCheckCircle } from 'react-icons/fi';

export default function TrainingAssignmentModal({ program, isOpen, onClose, onAssign }) {
  if (!program) return null;

  const [targetType, setTargetType] = useState('Department');
  const [targetValue, setTargetValue] = useState('Engineering');
  const [dueDate, setDueDate] = useState(program.completionDeadline || '2026-08-31');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign(program.id, targetType, targetValue, dueDate);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assign Training — ${program.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 text-violet-800 dark:text-violet-300 font-semibold">
          <p>Assigning <strong>{program.id}</strong> ({program.category})</p>
          <span className="text-[11px] text-violet-600 dark:text-violet-400">Duration: {program.duration} · Mode: {program.mode}</span>
        </div>

        <div>
          <label className="text-slate-500 font-semibold block mb-1">Assignment Target *</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['Individual', 'Department', 'Role', 'Organization'].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTargetType(t)}
                className={`py-2 px-3 rounded-xl border text-center font-bold ${
                  targetType === t
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {targetType === 'Department' && (
          <div>
            <label className="text-slate-500 font-semibold block mb-1">Select Department *</label>
            <select
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none font-bold"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

        {targetType === 'Individual' && (
          <div>
            <label className="text-slate-500 font-semibold block mb-1">Employee Name / ID *</label>
            <input
              type="text"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder="e.g. Arjun Mehta (EMP-2026-0014)"
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none font-bold"
            />
          </div>
        )}

        <div>
          <label className="text-slate-500 font-semibold block mb-1">Completion Due Date *</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none font-bold"
          />
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-700 pt-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 font-semibold">
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-md"
          >
            <FiCheckCircle size={15} /> Confirm & Assign Training
          </button>
        </div>
      </form>
    </Modal>
  );
}
