import React from 'react';
import Modal from '../Modal';
import OfferPreview from './OfferPreview';
import { FiPrinter, FiDownload } from 'react-icons/fi';

export default function OfferPreviewModal({ offer, isOpen, onClose }) {
  if (!offer) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Offer Packet Preview — ${offer.candidateName} (${offer.id})`}>
      <div className="space-y-4">
        <OfferPreview offer={offer} />

        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4 text-xs">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
          >
            <FiPrinter size={14} /> Print A4 Offer
          </button>
          <button
            onClick={() => alert(`Downloading PDF for offer ${offer.id}...`)}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold"
          >
            <FiDownload size={14} /> Download PDF Packet
          </button>
        </div>
      </div>
    </Modal>
  );
}
