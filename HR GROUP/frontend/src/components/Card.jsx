import React from 'react';

export default function Card({ title, subtitle, extra, children, className = '', ...props }) {
  return (
    <div
      className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm space-y-4 ${className}`}
      {...props}
    >
      {/* Card Header (Optional) */}
      {(title || subtitle || extra) && (
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-none">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {extra && <div className="text-sm">{extra}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className="text-sm text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </div>
  );
}
