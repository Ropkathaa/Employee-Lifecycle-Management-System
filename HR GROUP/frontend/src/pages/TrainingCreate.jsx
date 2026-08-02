import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { useTraining } from '../hooks/useTraining';
import { TRAINING_CATEGORIES, TRAINING_MODES, PRIORITY_LEVELS } from '../config/trainingConstants';
import { FiCheckCircle, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

export default function TrainingCreate() {
  const navigate = useNavigate();
  const { createTraining } = useTraining();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'Security',
    department: 'All Departments',
    isMandatory: true,
    duration: '3 Hours',
    instructor: 'Corporate HR & Compliance',
    mode: 'Online',
    priority: 'Critical',
    startDate: new Date().toISOString().split('T')[0],
    completionDeadline: '2026-08-31',
    description: '',
  });

  const handleChange = (key, val) => setFormData((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter program name.');
      return;
    }
    createTraining(formData);
    navigate('/training');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Create Mandatory Training Program"
        breadcrumbs={[
          { label: 'Training Management', path: '/training' },
          { label: 'Create Program', path: '/training/create' },
        ]}
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6 text-xs p-2">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step === s ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                  {s}
                </span>
                <span className={`hidden sm:inline font-semibold ${step === s ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`}>
                  {s === 1 ? 'Program Info' : s === 2 ? 'Delivery' : s === 3 ? 'Schedule' : s === 4 ? 'Resources' : 'Review & Publish'}
                </span>
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Training Program Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g. Annual POSH Awareness & Workplace Ethics 2026"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-semibold"
                  >
                    {TRAINING_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block mb-1">Priority Level *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-semibold"
                  >
                    {PRIORITY_LEVELS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Delivery Mode *</label>
                <select
                  value={formData.mode}
                  onChange={(e) => handleChange('mode', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-semibold"
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
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-semibold"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="text-slate-500 font-semibold block mb-1">Completion Deadline *</label>
                <input
                  type="date"
                  value={formData.completionDeadline}
                  onChange={(e) => handleChange('completionDeadline', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 text-center space-y-2">
              <p className="font-bold text-slate-900 dark:text-white">Training Materials & Assets</p>
              <p className="text-slate-400">Attach course PDFs, video links, or SCORM zip files.</p>
            </div>
          )}

          {step === 5 && (
            <div className="p-4 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{formData.name}</h3>
              <p className="text-slate-500">Category: {formData.category} · Priority: {formData.priority} · Mode: {formData.mode}</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
            <button type="button" disabled={step <= 1} onClick={() => setStep(step - 1)} className="flex items-center gap-1 px-4 py-2 rounded-xl border disabled:opacity-40">
              <FiArrowLeft size={14} /> Back
            </button>
            {step < 5 ? (
              <button type="button" onClick={() => setStep(step + 1)} className="flex items-center gap-1 px-6 py-2.5 rounded-xl bg-violet-600 text-white font-bold">
                Next <FiArrowRight size={14} />
              </button>
            ) : (
              <button type="submit" className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold shadow-md">
                <FiCheckCircle size={15} /> Publish Program
              </button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
