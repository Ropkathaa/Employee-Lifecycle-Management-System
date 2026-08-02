import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

function formatTime(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short',
  });
}

export default function NotificationCard({ approval, onApprove, onReject }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 -mx-5 px-5 transition-colors duration-150">
      <div className={`w-9 h-9 rounded-full ${approval.avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
        {approval.avatarInitials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{approval.requestedBy}</p>
            <span className="text-xs font-medium text-violet-600 dark:text-violet-400">{approval.type}</span>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">{formatTime(approval.submittedAt)}</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{approval.detail}</p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onApprove?.(approval.id)}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md
              bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400
              hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors duration-150"
          >
            <FiCheck size={11} /> Approve
          </button>
          <button
            onClick={() => onReject?.(approval.id)}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md
              bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400
              hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors duration-150"
          >
            <FiX size={11} /> Reject
          </button>
        </div>
      </div>
    </div>
  );
}
