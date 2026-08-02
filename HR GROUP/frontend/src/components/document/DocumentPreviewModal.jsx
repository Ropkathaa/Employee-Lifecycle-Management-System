import React from 'react';
import Modal from '../Modal';
import VerificationBadge from './VerificationBadge';
import ExpiryBadge from './ExpiryBadge';
import { formatDateDDMMYYYY } from '../../utils/dateValidation';
import { formatFileSize } from '../../utils/documentHelpers';
import { FiDownload, FiPrinter, FiFileText, FiExternalLink } from 'react-icons/fi';

export default function DocumentPreviewModal({ document, isOpen, onClose }) {
  if (!document) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Document Preview — ${document.name}`}>
      <div className="space-y-4 text-xs">
        {/* Preview Frame Container */}
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center min-h-[220px] flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <FiFileText size={32} />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{document.name}</p>
            <p className="text-slate-400 text-xs">{document.type} · {document.format} · {formatFileSize(document.sizeBytes)}</p>
          </div>
          <span className="text-[11px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded">
            Interactive PDF / Image viewer placeholder ready for Phase 2 Cloud Storage integration
          </span>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
          <div><span className="text-slate-400">Employee</span><p className="font-semibold text-slate-800 dark:text-slate-200">{document.employeeName} ({document.employeeId})</p></div>
          <div><span className="text-slate-400">Department</span><p className="font-semibold text-slate-800 dark:text-slate-200">{document.department}</p></div>
          <div><span className="text-slate-400">Category</span><p className="font-semibold text-slate-800 dark:text-slate-200">{document.category}</p></div>
          <div><span className="text-slate-400">Upload Date</span><p className="font-semibold text-slate-800 dark:text-slate-200">{formatDateDDMMYYYY(document.uploadDate)}</p></div>
          <div><span className="text-slate-400">Verification</span><div className="mt-0.5"><VerificationBadge status={document.status} /></div></div>
          <div><span className="text-slate-400">Expiry</span><div className="mt-0.5"><ExpiryBadge expiryDate={document.expiryDate} /></div></div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
          >
            <FiPrinter size={14} /> Print
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Downloading ${document.name}...`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold"
            >
              <FiDownload size={14} /> Download File
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
