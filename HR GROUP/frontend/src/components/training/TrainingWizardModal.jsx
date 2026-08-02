import React, { useState } from 'react';
import Modal from '../Modal';
import { TRAINING_CATEGORIES, TRAINING_MODES, PRIORITY_LEVELS, RECURRENCE_OPTIONS } from '../../config/trainingConstants';
import { DEPARTMENTS } from '../../mock/employees';
import { FiCheckCircle, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

export default function TrainingWizardModal({ isOpen, onClose, onCreate }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'Security',
    department: 'All Departments',
    isMandatory: true,
    duration: '2 Hours',
    instructor: 'HR Compliance Team',
    mode: 'Online',
    priority: 'High',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    completionDeadline: '2026-08-31',
    recurrence: 'Yearly',
    description: '',
  });

  const handleChange = (key, val) => setFormData((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter Training Program Name.');
      return;
    }
    onCreate(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Training Program — Multi-Step Wizard">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Wizard Step Indicator Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${step === s ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                {s}
              </span>
              <span className={`hidden sm:inline text-[11px] font-semibold ${step === s ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`}>
                {s === 1 ? 'Info' : s === 2 ? 'Delivery' : s === 3 ? 'Schedule' : s === 4 ? 'Resources' : 'Review'}
              </span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Training Program Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Anti-Bribery & Fraud Prevention 2026"
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Course Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value)}
                  placeholder="e.g. COMP-201"
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none font-semibold"
                >
                  {TRAINING_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Delivery Mode *</label>
                <select
                  value={formData.mode}
                  onChange={(e) => handleChange('mode', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none font-semibold"
                >
                  {TRAINING_MODES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Instructor / Lead *</label>
                <input
                  type="text"
                  value={formData.instructor}
                  onChange={(e) => handleChange('instructor', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none font-semibold"
                />
              </div>
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Estimated Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Completion Deadline *</label>
                <input
                  type="date"
                  value={formData.completionDeadline}
                  onChange={(e) => handleChange('completionDeadline', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center space-y-2">
            <p className="font-bold text-slate-900 dark:text-white">Training Resources & Materials</p>
            <p className="text-[11px] text-slate-400">Attach slide decks, SCORM packages, or video links.</p>
            <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-400">
              Drag & Drop PDF or MP4 files here (Mock Placeholder)
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-2 p-3.5 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800">
            <h4 className="font-bold text-slate-900 dark:text-white">{formData.name}</h4>
            <p className="text-[11px] text-slate-400">Category: {formData.category} · Mode: {formData.mode} · Duration: {formData.duration}</p>
            <p className="text-[11px] text-slate-400">Completion Deadline: <strong>{formData.completionDeadline}</strong></p>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-3">
          <button
            type="button"
            disabled={step <= 1}
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40"
          >
            <FiArrowLeft size={14} /> Back
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1 px-5 py-2 rounded-xl bg-violet-600 text-white font-bold"
            >
              Next <FiArrowRight size={14} />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
            >
              <FiCheckCircle size={15} /> Publish Program
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
