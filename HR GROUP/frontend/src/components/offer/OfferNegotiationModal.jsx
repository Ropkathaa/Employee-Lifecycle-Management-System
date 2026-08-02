import React, { useState } from 'react';
import Modal from '../Modal';
import { FiMessageSquare, FiSend } from 'react-icons/fi';

export default function OfferNegotiationModal({ offer, isOpen, onClose, onSubmitNegotiation }) {
  if (!offer) return null;

  const [requestType, setRequestType] = useState('Higher Salary');
  const [comments, setComments] = useState('');
  const [hrResponse, setHrResponse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comments.trim()) {
      alert('Please enter candidate request comments.');
      return;
    }

    onSubmitNegotiation({
      requestType,
      comments,
      hrResponse: hrResponse || 'Under Management Review',
      requestedBy: `${offer.candidateName} (Candidate)`,
      status: 'Under Negotiation',
    });

    setComments('');
    setHrResponse('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Record Negotiation Request — ${offer.id}`}>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="text-slate-500 font-semibold block mb-1">Negotiation Request Category *</label>
          <select
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none font-bold"
          >
            <option value="Higher Salary">Higher Salary / CTC Revision</option>
            <option value="Different Joining Date">Different Joining Date</option>
            <option value="Additional Benefits">Additional Perks & Benefits</option>
            <option value="Change in Designation">Change in Designation / Band</option>
            <option value="Relocation Request">Relocation / WFH Allowance</option>
            <option value="Custom Request">Custom / Other Request</option>
          </select>
        </div>

        <div>
          <label className="text-slate-500 font-semibold block mb-1">Candidate Feedback & Requested Changes *</label>
          <textarea
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="e.g. Candidate requested ₹19.5L CTC citing competing offer..."
            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
          />
        </div>

        <div>
          <label className="text-slate-500 font-semibold block mb-1">HR Initial Response / Action</label>
          <textarea
            rows={2}
            value={hrResponse}
            onChange={(e) => setHrResponse(e.target.value)}
            placeholder="e.g. Management counter-offered ₹19L with ₹1L joining bonus..."
            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-700 pt-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 font-semibold">
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold"
          >
            <FiSend size={14} /> Record Negotiation Request
          </button>
        </div>
      </form>
    </Modal>
  );
}
