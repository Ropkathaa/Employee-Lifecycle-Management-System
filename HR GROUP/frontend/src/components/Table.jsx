import React from 'react';

export default function Table({
  headers = [],
  data = [],
  renderRow,
  loading = false,
  emptyMessage = 'No data available',
}) {
  return (
    <div className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider text-left py-3 px-4"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={headers.length} className="py-8 px-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Loading records...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="py-12 px-4 text-center text-sm text-slate-500 dark:text-slate-400 font-normal"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, idx) => renderRow(item, idx))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
