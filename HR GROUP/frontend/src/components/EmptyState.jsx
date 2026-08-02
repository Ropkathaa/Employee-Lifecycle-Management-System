import React from 'react';
import Button from './Button';

export default function EmptyState({
  title = 'No records found',
  description = 'There is currently no data to display in this list.',
  icon: Icon,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-12 border border-dashed border-border rounded-xl bg-surface/50 ${className}`}>
      {Icon && (
        <div className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full mb-4">
          <Icon size={32} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
