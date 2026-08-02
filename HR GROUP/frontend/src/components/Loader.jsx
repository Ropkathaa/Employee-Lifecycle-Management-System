import React from 'react';

export default function Loader({ variant = 'spinner', rows = 3, className = '' }) {
  if (variant === 'skeleton') {
    return (
      <div className={`space-y-3 animate-pulse ${className}`}>
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  );
}
