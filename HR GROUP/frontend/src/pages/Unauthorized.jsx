import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { FiLock } from 'react-icons/fi';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="p-4 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full mb-6">
        <FiLock size={48} />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
        Access Denied
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
        You do not have the required role authorizations to view this administrative view.
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
