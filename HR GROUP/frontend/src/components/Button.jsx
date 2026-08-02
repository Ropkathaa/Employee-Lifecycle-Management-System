import React from 'react';

export default function Button({
  type = 'button',
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  onClick,
  disabled = false,
  children,
  ...props
}) {
  const baseStyle = 'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 min-h-[44px] px-4 py-2 disabled:opacity-50 disabled:pointer-events-none disabled:scale-100';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white focus:ring-primary/50',
    secondary: 'bg-secondary/10 hover:bg-secondary/20 text-slate-700 dark:text-slate-200 focus:ring-slate-300 dark:focus:ring-slate-700',
    outline: 'border border-border hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-slate-300 dark:focus:ring-slate-700',
    danger: 'bg-danger hover:bg-danger/90 text-white focus:ring-danger/50',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant]} ${widthStyle}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
}
