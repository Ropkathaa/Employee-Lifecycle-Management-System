import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { FiAlertTriangle } from 'react-icons/fi';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full mb-6">
        <FiAlertTriangle size={48} />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
        The requested path does not exist on this console. Verify the URL or return to dashboard.
      </p>
      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Home Dashboard
        </Button>
      </div>
    </div>
  );
}
