import React from 'react';
import { FiSearch } from 'react-icons/fi';

/**
 * Reusable SearchBar Component.
 * Safely extracts text value from event objects before calling onChange.
 */
export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Search...',
  className = '',
  ...props
}) {
  const safeValue = typeof value === 'string' ? value : String(value || '');

  const handleChange = (e) => {
    const textVal = typeof e === 'string' ? e : e?.target?.value ?? '';
    if (onChange) {
      onChange(textVal, e);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <FiSearch size={18} />
      </div>
      <input
        type="text"
        className="w-full min-h-[44px] pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm rounded-lg outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder-slate-400 text-slate-900 dark:text-white"
        placeholder={placeholder}
        value={safeValue}
        onChange={handleChange}
        {...props}
      />
    </div>
  );
}
