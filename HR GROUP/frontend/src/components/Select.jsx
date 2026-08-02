import React from 'react';

export default function Select({
  label,
  value,
  onChange,
  options = [],
  error,
  required = false,
  placeholder = 'Select an option',
  ...props
}) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        className={`w-full min-h-[44px] px-3 py-2 border ${
          error ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary/20'
        } bg-white dark:bg-slate-800 text-sm rounded-lg outline-none transition-all focus:ring-2 text-slate-900 dark:text-white cursor-pointer`}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-rose-500 block">{error}</span>}
    </div>
  );
}
