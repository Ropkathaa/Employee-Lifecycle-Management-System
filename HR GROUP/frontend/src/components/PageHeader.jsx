import React from 'react';
import Breadcrumb from './Breadcrumb';

export default function PageHeader({ title, breadcrumbs = [], actions }) {
  return (
    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0 border-b border-border pb-5 mb-6">
      <div className="space-y-1">
        {breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
      </div>
      {actions && (
        <div className="flex items-center space-x-3 w-full md:w-auto md:justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}
