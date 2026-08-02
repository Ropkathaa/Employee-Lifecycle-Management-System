import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo Icon */}
        <div className="mx-auto h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-primary/20">
          H
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          HR Automation Platform
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          Enterprise Human Resources Console
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface border border-border py-8 px-4 shadow-sm rounded-xl sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
