import React from 'react';
import { useNavigate } from 'react-router-dom';
import TrainingStatusBadge from './TrainingStatusBadge';
import TrainingProgressBar from './TrainingProgressBar';
import { FiBookOpen, FiEye, FiUserPlus, FiCheckSquare } from 'react-icons/fi';

export default function TrainingTable({
  programs,
  page = 1,
  totalPages = 1,
  onPageChange,
  onOpenAssignModal,
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-xs text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase">
              <th className="py-3 px-4">Training Program</th>
              <th className="py-3 px-4">Category & Department</th>
              <th className="py-3 px-4">Priority & Type</th>
              <th className="py-3 px-4">Duration & Mode</th>
              <th className="py-3 px-4">Deadline</th>
              <th className="py-3 px-4">Completion Rate</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {programs.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-400">
                  <FiCheckSquare size={32} className="mx-auto mb-2 opacity-50" />
                  No training programs match current filter parameters.
                </td>
              </tr>
            ) : (
              programs.map((p) => {
                const assigned = p.stats?.assignedCount || 0;
                const completed = p.stats?.completedCount || 0;
                const completionPct = assigned > 0 ? Math.round((completed / assigned) * 100) : 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex-shrink-0">
                          <FiBookOpen size={18} />
                        </div>
                        <div>
                          <button
                            onClick={() => navigate(`/training/${p.id}`)}
                            className="font-bold text-slate-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 text-left block"
                          >
                            {p.name}
                          </button>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {p.id} · Code: {p.code}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{p.category}</p>
                      <span className="text-[11px] text-slate-400">{p.department}</span>
                    </td>
                    <td className="py-3 px-4 space-y-1">
                      <TrainingStatusBadge status={p.priority} />
                      <div>
                        <TrainingStatusBadge status={p.isMandatory} type="mandatory" />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{p.duration}</p>
                      <span className="text-[11px] text-slate-400">{p.mode} · {p.instructor}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {p.completionDeadline || 'N/A'}
                    </td>
                    <td className="py-3 px-4 w-36">
                      <TrainingProgressBar progress={completionPct} size="sm" showLabel={false} />
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                        {completed}/{assigned} completed ({completionPct}%)
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <TrainingStatusBadge status={p.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/training/${p.id}`)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                          title="View Program Details"
                        >
                          <FiEye size={14} />
                        </button>
                        <button
                          onClick={() => onOpenAssignModal(p)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-violet-600 dark:text-violet-400"
                          title="Assign Training to Employees"
                        >
                          <FiUserPlus size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
        <span>Page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
