import React, { useState } from 'react';
import { BUILTIN_REPORT_TEMPLATES, EXPORT_FORMATS } from '../../config/reportTemplates';
import { DEPARTMENTS } from '../../mock/employees';
import { FiCheckCircle, FiArrowRight, FiArrowLeft, FiDownload } from 'react-icons/fi';

export default function ReportBuilder({ onCompleteReport, onExport }) {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(BUILTIN_REPORT_TEMPLATES[0]);
  const [dateRange, setDateRange] = useState('This Quarter');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [exportFormat, setExportFormat] = useState('PDF');

  const handleFinish = (e) => {
    e.preventDefault();
    onCompleteReport({
      templateId: selectedTemplate.id,
      title: selectedTemplate.name,
      dateRange,
      department: selectedDept,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-6 text-xs max-w-4xl mx-auto">
      {/* 7-Step Indicator Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4 overflow-x-auto">
        {[1, 2, 3, 4, 5, 6, 7].map((s) => (
          <div key={s} className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step === s ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
              {s}
            </span>
            <span className={`hidden md:inline font-semibold text-[11px] ${step === s ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`}>
              {s === 1 ? 'Template' : s === 2 ? 'Date' : s === 3 ? 'Depts' : s === 4 ? 'Roles' : s === 5 ? 'Columns' : s === 6 ? 'Preview' : 'Export'}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 dark:text-white">Step 1: Select Report Template</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BUILTIN_REPORT_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`p-3.5 rounded-xl border cursor-pointer ${
                  selectedTemplate.id === tpl.id ? 'border-violet-600 bg-violet-50/50 dark:bg-violet-950/40' : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <h5 className="font-bold text-slate-900 dark:text-white">{tpl.name}</h5>
                <p className="text-[11px] text-slate-400 mt-1">{tpl.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 dark:text-white">Step 2: Choose Date Range</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['Today', 'This Week', 'This Month', 'This Quarter', 'This Year', 'Custom Range'].map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`p-3 rounded-xl border font-bold text-center ${
                  dateRange === r ? 'bg-violet-600 text-white border-violet-600' : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 dark:text-white">Step 3: Choose Department Scope</h4>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
          >
            <option value="All Departments">All Departments (Entire Organization)</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      )}

      {step >= 4 && step <= 5 && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 text-center space-y-2">
          <h4 className="font-bold text-slate-900 dark:text-white">Step {step}: Filter Roles & Select Columns</h4>
          <p className="text-slate-400">Columns auto-populated from template: {selectedTemplate.defaultColumns.join(', ')}</p>
        </div>
      )}

      {step === 6 && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
          <h4 className="font-bold text-slate-900 dark:text-white">Step 6: Live Report Preview</h4>
          <p className="text-slate-600 dark:text-slate-300">Ready to generate <strong>{selectedTemplate.name}</strong> for <strong>{selectedDept}</strong> ({dateRange}).</p>
        </div>
      )}

      {step === 7 && (
        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 dark:text-white">Step 7: Choose Export Format</h4>
          <div className="grid grid-cols-3 gap-3">
            {EXPORT_FORMATS.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setExportFormat(fmt)}
                className={`p-3 rounded-xl border font-bold text-center ${
                  exportFormat === fmt ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-700'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
        <button type="button" disabled={step <= 1} onClick={() => setStep(step - 1)} className="flex items-center gap-1 px-4 py-2 rounded-xl border disabled:opacity-40">
          <FiArrowLeft size={14} /> Back
        </button>
        {step < 7 ? (
          <button type="button" onClick={() => setStep(step + 1)} className="flex items-center gap-1 px-6 py-2.5 rounded-xl bg-violet-600 text-white font-bold">
            Next <FiArrowRight size={14} />
          </button>
        ) : (
          <button onClick={handleFinish} className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold shadow-md">
            <FiCheckCircle size={15} /> Generate & Export Report ({exportFormat})
          </button>
        )}
      </div>
    </div>
  );
}
