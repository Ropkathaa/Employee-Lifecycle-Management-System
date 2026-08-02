import React from 'react';
import { FiFileText, FiPlay, FiDownload } from 'react-icons/fi';

export default function ReportTable({ templates = [], onGenerate, onExport }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden text-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase">
              <th className="py-3 px-4">Report Template Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {templates.map((tpl) => (
              <tr key={tpl.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex-shrink-0">
                      <FiFileText size={18} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{tpl.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{tpl.id}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                  <span className="bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 rounded-full text-[11px]">
                    {tpl.category}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{tpl.description}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onGenerate(tpl)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold"
                    >
                      <FiPlay size={12} /> Run Report
                    </button>
                    <button
                      onClick={() => onExport(tpl.id, 'PDF')}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-600"
                      title="Quick PDF Export"
                    >
                      <FiDownload size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
