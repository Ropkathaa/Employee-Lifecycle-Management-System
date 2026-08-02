import React from 'react';

const SIZE_MAP = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base font-bold',
  xl: 'w-20 h-20 text-xl font-bold',
};

const DOT_SIZE_MAP = {
  xs: 'w-1.5 h-1.5 bottom-0 right-0',
  sm: 'w-2 h-2 bottom-0 right-0',
  md: 'w-2.5 h-2.5 bottom-0 right-0',
  lg: 'w-3.5 h-3.5 bottom-0.5 right-0.5 ring-2 ring-white dark:ring-slate-800',
  xl: 'w-4 h-4 bottom-1 right-1 ring-2 ring-white dark:ring-slate-800',
};

const STATUS_DOT_COLORS = {
  Active: 'bg-emerald-500',
  Probation: 'bg-amber-500',
  Suspended: 'bg-rose-500',
  Resigned: 'bg-slate-400',
};

/**
 * Reusable Avatar component for employee profile pictures or initials.
 */
export default function EmployeeAvatar({
  initials = 'EM',
  color = 'bg-violet-500',
  src = null,
  name = '',
  size = 'md',
  status = null,
  className = '',
}) {
  const sizeCls = SIZE_MAP[size] || SIZE_MAP.md;
  const dotSizeCls = DOT_SIZE_MAP[size] || DOT_SIZE_MAP.md;
  const dotColorCls = STATUS_DOT_COLORS[status] || STATUS_DOT_COLORS.Active;

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name || initials}
          className={`${sizeCls} rounded-full object-cover border border-slate-200 dark:border-slate-700`}
        />
      ) : (
        <div
          className={`${sizeCls} ${color} rounded-full flex items-center justify-center text-white font-semibold uppercase tracking-wider shadow-sm`}
        >
          {initials}
        </div>
      )}

      {status && (
        <span
          className={`absolute rounded-full ${dotColorCls} ${dotSizeCls}`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
}
