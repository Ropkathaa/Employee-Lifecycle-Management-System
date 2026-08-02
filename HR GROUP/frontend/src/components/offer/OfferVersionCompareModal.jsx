import React, { useState } from 'react';
import Modal from '../Modal';
import { compareOfferVersions } from '../../utils/offerHelpers';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function OfferVersionCompareModal({ offer, isOpen, onClose }) {
  if (!offer || !offer.versions || offer.versions.length === 0) return null;

  const versionsList = offer.versions;
  const [verAIndex, setVerAIndex] = useState(versionsList.length - 1); // Oldest version default
  const [verBIndex, setVerBIndex] = useState(0); // Latest version default

  const versionA = versionsList[verAIndex] || versionsList[0];
  const versionB = versionsList[verBIndex] || versionsList[0];

  const diffItems = compareOfferVersions(
    versionA.snapshot || versionA,
    versionB.snapshot || versionB
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Side-by-Side Version Comparison — ${offer.id}`}>
      <div className="space-y-4 text-xs">
        {/* Version Selection Strip */}
        <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
          <div>
            <label className="text-slate-500 font-semibold block mb-1">Baseline Version (A)</label>
            <select
              value={verAIndex}
              onChange={(e) => setVerAIndex(Number(e.target.value))}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none font-bold"
            >
              {versionsList.map((v, idx) => (
                <option key={v.version} value={idx}>
                  Version {v.version} ({v.date}) — {v.summary}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-500 font-semibold block mb-1">Compared Version (B)</label>
            <select
              value={verBIndex}
              onChange={(e) => setVerBIndex(Number(e.target.value))}
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none font-bold"
            >
              {versionsList.map((v, idx) => (
                <option key={v.version} value={idx}>
                  Version {v.version} ({v.date}) — {v.summary}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Diff Comparison Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                <th className="py-2.5 px-3">Offer Attribute</th>
                <th className="py-2.5 px-3 bg-slate-50/50 dark:bg-slate-800/50">Version {versionA.version}</th>
                <th className="py-2.5 px-3 bg-violet-50/40 dark:bg-violet-950/20">Version {versionB.version}</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {diffItems.map((item) => (
                <tr
                  key={item.field}
                  className={item.isDifferent ? 'bg-amber-50/50 dark:bg-amber-950/20 font-semibold' : ''}
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{item.label}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{item.valA}</td>
                  <td className="py-2.5 px-3 text-slate-900 dark:text-white font-bold">{item.valB}</td>
                  <td className="py-2.5 px-3 text-center">
                    {item.isDifferent ? (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                        <FiAlertCircle size={12} /> Changed
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Unchanged</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
