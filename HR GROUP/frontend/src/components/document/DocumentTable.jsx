import React from 'react';
import { useNavigate } from 'react-router-dom';
import VerificationBadge from './VerificationBadge';
import ExpiryBadge from './ExpiryBadge';
import { formatDateDDMMYYYY } from '../../utils/dateValidation';
import { formatFileSize } from '../../utils/documentHelpers';
import { FiFileText, FiDownload, FiEye, FiTrash2, FiCheckSquare } from 'react-icons/fi';

export default function DocumentTable({
  documents,
  onPreview,
  onDelete,
  page = 1,
  totalPages = 1,
  onPageChange,
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-xs text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase">
              <th className="py-3 px-4">Document Details</th>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Category / Type</th>
              <th className="py-3 px-4">Upload Date</th>
              <th className="py-3 px-4">Expiry Status</th>
              <th className="py-3 px-4">Verification</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400">
                  <FiCheckSquare size={32} className="mx-auto mb-2 opacity-50" />
                  No documents found matching current filter parameters.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex-shrink-0">
                        <FiFileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <button
                          onClick={() => navigate(`/documents/${doc.id}`)}
                          className="font-bold text-slate-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 truncate block text-left"
                        >
                          {doc.name}
                        </button>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {doc.id} · {formatFileSize(doc.sizeBytes)} · v{doc.version || 1}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => navigate(`/employees/${doc.employeeId}`)}
                      className="font-semibold text-slate-800 dark:text-slate-200 hover:underline block text-left"
                    >
                      {doc.employeeName}
                    </button>
                    <span className="text-[11px] text-slate-400">{doc.employeeId} · {doc.department}</span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{doc.type}</p>
                    <span className="text-[11px] text-slate-400">{doc.category}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    {formatDateDDMMYYYY(doc.uploadDate)}
                  </td>
                  <td className="py-3 px-4">
                    <ExpiryBadge expiryDate={doc.expiryDate} />
                  </td>
                  <td className="py-3 px-4">
                    <VerificationBadge status={doc.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onPreview(doc)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                        title="Quick Preview"
                      >
                        <FiEye size={14} />
                      </button>
                      <button
                        onClick={() => navigate(`/documents/${doc.id}`)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                        title="View Full Details & Verify"
                      >
                        <FiCheckSquare size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(doc.id)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-rose-50 text-rose-500 dark:hover:bg-rose-950/30"
                        title="Delete Document"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
        <span>Page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
