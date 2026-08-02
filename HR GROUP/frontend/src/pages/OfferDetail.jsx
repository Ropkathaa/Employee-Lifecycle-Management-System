import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import OfferStatusBadge from '../components/offer/OfferStatusBadge';
import OfferPreview from '../components/offer/OfferPreview';
import OfferAuditTrailModal from '../components/offer/OfferAuditTrailModal';
import OfferNegotiationModal from '../components/offer/OfferNegotiationModal';
import OfferVersionCompareModal from '../components/offer/OfferVersionCompareModal';
import { useOffers } from '../hooks/useOffers';
import { isOfferEditable } from '../utils/offerHelpers';
import {
  FiFileText, FiCheckCircle, FiXCircle, FiEdit3,
  FiArrowLeft, FiUserCheck, FiList, FiMessageSquare, FiColumns,
} from 'react-icons/fi';

export default function OfferDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOfferById, approveOffer, rejectOffer, acceptOffer, recordNegotiation } = useOffers();

  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const offer = getOfferById(id);

  if (!offer) {
    return (
      <div className="space-y-6">
        <PageHeader title="Offer Not Found" breadcrumbs={[{ label: 'Offers', path: '/offers' }]} />
        <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 mb-4">Offer ID "{id}" was not found in records.</p>
          <button onClick={() => navigate('/offers')} className="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-semibold">
            Back to Offers Roster
          </button>
        </div>
      </div>
    );
  }

  const editable = isOfferEditable(offer.status);

  const handleApprove = () => approveOffer(offer.id, 'Priya Sharma (HR Director)', 'Approved budget CTC');
  const handleReject = () => {
    if (!rejectReason.trim()) { alert('Please enter rejection reason.'); return; }
    rejectOffer(offer.id, 'HR Director', rejectReason);
    setShowRejectForm(false);
  };
  const handleAccept = () => acceptOffer(offer.id);

  const handleRecordNegotiationSubmit = (negData) => {
    recordNegotiation(offer.id, negData);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Offer Packet — ${offer.candidateName}`}
        breadcrumbs={[
          { label: 'Offers', path: '/offers' },
          { label: offer.id, path: `/offers/${offer.id}` },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {editable && (
              <button
                onClick={() => navigate(`/offers/${offer.id}/edit`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm"
              >
                <FiEdit3 size={14} /> Edit & Revise Offer
              </button>
            )}
            <button onClick={() => navigate('/offers')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold">
              <FiArrowLeft size={14} /> Back to Offers
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Printable A4 Preview */}
        <div className="xl:col-span-2 space-y-6">
          <OfferPreview offer={offer} />

          {/* Negotiation History Card */}
          <Card title="Candidate Negotiation History">
            <div className="space-y-3 text-xs">
              {(offer.negotiations || []).length === 0 ? (
                <p className="text-slate-400 italic">No negotiation records recorded for this offer packet.</p>
              ) : (
                offer.negotiations.map((neg) => (
                  <div key={neg.round} className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>Round {neg.round}: {neg.requestType}</span>
                      <span className="text-[11px] font-normal text-slate-400">{neg.timestamp}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">
                      <strong className="text-slate-500">Candidate Request:</strong> "{neg.comments}"
                    </p>
                    <p className="text-violet-700 dark:text-violet-300">
                      <strong className="text-slate-500">HR Action/Response:</strong> "{neg.hrResponse}"
                    </p>
                  </div>
                ))
              )}

              {editable && (
                <button
                  onClick={() => setShowNegotiationModal(true)}
                  className="w-full py-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-xl font-bold border border-amber-200 dark:border-amber-800 flex items-center justify-center gap-2"
                >
                  <FiMessageSquare size={14} /> Record Candidate Negotiation Request
                </button>
              )}
            </div>
          </Card>

          {/* Version History Table & Compare Button */}
          <Card title="Offer Packet Version Timeline">
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Versions: <strong>{(offer.versions || []).length}</strong></span>
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 font-bold border border-violet-200 dark:border-violet-800"
                >
                  <FiColumns size={13} /> Compare Versions Side-by-Side
                </button>
              </div>

              <div className="space-y-2">
                {(offer.versions || []).map((v) => (
                  <div key={v.version} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="font-bold text-violet-600 font-mono">v{v.version}</span>
                      <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{v.summary}</span>
                      <p className="text-[11px] text-slate-400">Date: {v.date} · Author: {v.author}</p>
                    </div>
                    <button onClick={() => setShowCompareModal(true)} className="text-violet-600 font-semibold hover:underline">Compare</button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Workflow Actions & Audit Log */}
        <div className="space-y-6 text-xs">
          {/* Approval Workflow Panel */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <h3 className="font-bold text-slate-900 dark:text-white">Workflow Approval Panel</h3>
              <OfferStatusBadge status={offer.status} />
            </div>

            {editable ? (
              <div className="space-y-2">
                <button onClick={() => navigate(`/offers/${offer.id}/edit`)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-sm">
                  <FiEdit3 size={16} /> Edit & Revise Offer (v{(offer.version || 1) + 1})
                </button>

                <button onClick={handleApprove} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm">
                  <FiCheckCircle size={16} /> Approve Offer Packet
                </button>

                <button onClick={handleAccept} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm">
                  <FiUserCheck size={16} /> Mark Accepted by Candidate
                </button>

                <button onClick={() => setShowRejectForm(true)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm">
                  <FiXCircle size={16} /> Reject Offer
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 text-slate-500 text-center font-semibold">
                🔒 Offer is in read-only status ({offer.status}).
              </div>
            )}

            {showRejectForm && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <label className="font-semibold text-rose-500 block">Rejection Reason</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. CTC exceeds budget band for grade..."
                  className="w-full p-2 border border-rose-300 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowRejectForm(false)} className="px-3 py-1.5 text-slate-500">Cancel</button>
                  <button onClick={handleReject} className="px-4 py-1.5 bg-rose-600 text-white font-bold rounded-lg">Confirm Reject</button>
                </div>
              </div>
            )}
          </div>

          {/* Audit Log Card */}
          <Card title="Audit Log Trail">
            <div className="space-y-3">
              <p className="text-slate-400">Immutable event log tracking offer state transitions.</p>
              <button
                onClick={() => setShowAuditModal(true)}
                className="w-full py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <FiList size={14} /> View Full Audit Trail ({offer.auditTrail?.length || 0} events)
              </button>
            </div>
          </Card>
        </div>
      </div>

      <OfferAuditTrailModal offer={offer} isOpen={showAuditModal} onClose={() => setShowAuditModal(false)} />
      <OfferNegotiationModal offer={offer} isOpen={showNegotiationModal} onClose={() => setShowNegotiationModal(false)} onSubmitNegotiation={handleRecordNegotiationSubmit} />
      <OfferVersionCompareModal offer={offer} isOpen={showCompareModal} onClose={() => setShowCompareModal(false)} />
    </div>
  );
}
