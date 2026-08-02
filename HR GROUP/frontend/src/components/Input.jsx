import React from 'react';

export default function Input({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  required = false,
  ...props
}) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`w-full min-h-[44px] px-3 py-2 border ${
          error ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary/20'
        } bg-white dark:bg-slate-800 text-sm rounded-lg outline-none transition-all focus:ring-2 placeholder-slate-400 text-slate-900 dark:text-white`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
      {error && <span className="text-xs text-rose-500 block">{error}</span>}
    </div>
  );
}
