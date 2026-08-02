import React from 'react';
import { FiCalendar, FiClock, FiCheckCircle, FiAward } from 'react-icons/fi';

export default function TrainingCalendar({ programs = [] }) {
  const events = programs.map((p) => ({
    id: p.id,
    title: p.name,
    date: p.completionDeadline || p.startDate,
    category: p.category,
    isMandatory: p.isMandatory,
  }));

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm text-xs">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400">
            <FiCalendar size={18} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">Training & Certification Calendar</h3>
        </div>
        <span className="text-[11px] text-slate-400">July — August 2026 Deadlines</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {events.map((evt) => (
          <div key={evt.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="font-mono font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1">
                <FiClock size={12} /> {evt.date}
              </span>
              {evt.isMandatory && (
                <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Mandatory
                </span>
              )}
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white truncate">{evt.title}</h4>
            <p className="text-[11px] text-slate-400">Category: {evt.category} · Code: {evt.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
