import React from 'react';
import { FiAward, FiCheckCircle, FiClock } from 'react-icons/fi';

export default function CertificateCard({ certificate }) {
  if (!certificate) return null;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm flex items-center justify-between text-xs">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex-shrink-0">
          <FiAward size={24} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">{certificate.trainingName}</h4>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Issued to: <strong>{certificate.employeeName}</strong> ({certificate.employeeId})
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Cert #: <span className="font-mono text-violet-600 font-bold">{certificate.certificateNumber}</span> · Issued: {certificate.issueDate}
          </p>
        </div>
      </div>

      <div className="text-right">
        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full font-bold border border-emerald-200 dark:border-emerald-800">
          <FiCheckCircle size={12} /> {certificate.status}
        </span>
        <span className="block text-[10px] text-slate-400 mt-1">Expires: {certificate.expiryDate}</span>
      </div>
    </div>
  );
}
