import React from 'react';
import { useNavigate } from 'react-router-dom';
import OfferStatusBadge from './OfferStatusBadge';
import { formatDateDDMMYYYY } from '../../utils/dateValidation';
import { formatCurrency, calculateOfferValidity } from '../../utils/offerHelpers';
import { FiFileText, FiEye, FiCheckCircle, FiTrash2, FiCheckSquare } from 'react-icons/fi';

export default function OfferTable({
  offers,
  onPreview,
  page = 1,
  totalPages = 1,
  onPageChange,
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-xs text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase">
              <th className="py-3 px-4">Offer ID & Candidate</th>
              <th className="py-3 px-4">Department & Role</th>
              <th className="py-3 px-4">Annual CTC</th>
              <th className="py-3 px-4">Generated Date</th>
              <th className="py-3 px-4">Offer Validity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {offers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400">
                  <FiCheckSquare size={32} className="mx-auto mb-2 opacity-50" />
                  No offer packets match current filter parameters.
                </td>
              </tr>
            ) : (
              offers.map((off) => {
                const validity = calculateOfferValidity(off.validUntilDate);
                return (
                  <tr key={off.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex-shrink-0">
                          <FiFileText size={18} />
                        </div>
                        <div>
                          <button
                            onClick={() => navigate(`/offers/${off.id}`)}
                            className="font-bold text-slate-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 truncate block text-left"
                          >
                            {off.candidateName}
                          </button>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {off.id} · v{off.version || 1}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{off.designation}</p>
                      <span className="text-[11px] text-slate-400">{off.department}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(off.compensation?.totalCTC)}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {formatDateDDMMYYYY(off.generatedDate)}
                    </td>
                    <td className="py-3 px-4">
                      {validity.status !== 'N/A' ? (
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded ${
                          validity.status === 'Valid' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' :
                          validity.status === 'Expiring Soon' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 animate-pulse' :
                          'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'
                        }`}>
                          {validity.status} ({validity.daysRemaining}d)
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <OfferStatusBadge status={off.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPreview(off)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                          title="Quick Preview"
                        >
                          <FiEye size={14} />
                        </button>
                        <button
                          onClick={() => navigate(`/offers/${off.id}`)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                          title="View Full Offer Details & Workflow"
                        >
                          <FiCheckCircle size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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
