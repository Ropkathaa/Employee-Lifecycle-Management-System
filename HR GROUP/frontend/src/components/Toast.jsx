import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { useEmployees } from '../hooks/useEmployees';

/**
 * Toast component displaying floating notification messages.
 * Auto-dismissed after 4 seconds as configured in EmployeeContext.
 */
export default function Toast() {
  const { toast } = useEmployees();

  if (!toast || !toast.visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-xl shadow-xl border border-slate-700 dark:border-slate-300 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <FiCheckCircle size={20} className="text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
      <span className="text-xs font-semibold">{toast.message}</span>
    </div>
  );
}
