import React from 'react';
import { FiAlertCircle, FiClock, FiDollarSign, FiBook, FiFileText } from 'react-icons/fi';

const PRIORITY_MAP = {
  critical: { label: 'Critical', cls: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400' },
  high:     { label: 'High',     cls: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
  medium:   { label: 'Medium',   cls: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
  low:      { label: 'Low',      cls: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' },
};

const TYPE_ICON_MAP = {
  approval: FiAlertCircle,
  payroll:  FiDollarSign,
  training: FiBook,
  document: FiFileText,
  default:  FiClock,
};

function formatDueDate(dateStr) {
  const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
  if (diff < 0) return 'Overdue';
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  return `Due in ${diff}d`;
}

export default function UpcomingTaskCard({ task }) {
  const priority = PRIORITY_MAP[task.priority] || PRIORITY_MAP.medium;
  const Icon = TYPE_ICON_MAP[task.type] || TYPE_ICON_MAP.default;
  const dueLabel = formatDueDate(task.dueDate);
  const isOverdue = dueLabel === 'Overdue';

  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0 group hover:bg-slate-50 dark:hover:bg-slate-700/30 -mx-5 px-5 transition-colors duration-150">
      <span className="mt-0.5 p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex-shrink-0 group-hover:scale-105 transition-transform duration-150">
        <Icon size={13} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{task.title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-1">{task.description}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${priority.cls}`}>
            {priority.label}
          </span>
          <span className={`text-xs font-medium ${isOverdue ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`}>
            {dueLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
