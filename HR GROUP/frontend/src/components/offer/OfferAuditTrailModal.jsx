import React from 'react';
import Modal from '../Modal';
import { FiCheckCircle, FiClock, FiFileText } from 'react-icons/fi';

export default function OfferAuditTrailModal({ offer, isOpen, onClose }) {
  if (!offer) return null;

  const auditTrail = offer.auditTrail || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Immutable Audit Log — ${offer.id}`}>
      <div className="space-y-4 text-xs">
        <p className="text-slate-400">
          Complete audit history tracking state transitions, timestamps, and HR actors for compliance.
        </p>

        <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
          {auditTrail.map((rec) => (
            <div key={rec.id || rec.timestamp} className="relative pl-8 space-y-1">
              <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-violet-600 border-2 border-white dark:border-slate-800" />
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>{rec.action}</span>
                  <span className="text-[11px] font-normal text-slate-400 font-mono">{rec.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Actor: <strong>{rec.user}</strong> · State: <span className="font-mono text-slate-600 dark:text-slate-300">{rec.previousState} › {rec.currentState}</span>
                </p>
                {rec.reason && (
                  <p className="text-[11px] text-slate-400 italic mt-1 bg-white dark:bg-slate-800 p-1.5 rounded border border-slate-100 dark:border-slate-700">
                    "{rec.reason}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
