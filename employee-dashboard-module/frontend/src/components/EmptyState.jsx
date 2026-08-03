import React from 'react';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ title = 'No records found', message, action, className }) => (
  <div className={className}>
    <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
<div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
        <FiInbox className="w-7 h-7 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
      {message && <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 max-w-sm">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  </div>
);

export default EmptyState;

