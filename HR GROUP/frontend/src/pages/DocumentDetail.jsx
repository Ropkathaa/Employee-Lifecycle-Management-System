import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import VerificationBadge from '../components/document/VerificationBadge';
import ExpiryBadge from '../components/document/ExpiryBadge';
import { useDocuments } from '../hooks/useDocuments';
import { formatDateDDMMYYYY } from '../utils/dateValidation';
import { formatFileSize } from '../utils/documentHelpers';
import {
  FiFileText, FiCheckCircle, FiXCircle, FiAlertCircle,
  FiDownload, FiPrinter, FiClock, FiUser, FiArrowLeft,
} from 'react-icons/fi';

export default function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocumentById, verifyDocument, deleteDocument } = useDocuments();
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const document = getDocumentById(id);

  if (!document) {
    return (
      <div className="space-y-6">
        <PageHeader title="Document Not Found" breadcrumbs={[{ label: 'Documents', path: '/documents' }]} />
        <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 mb-4">Document ID "{id}" was not found in records.</p>
          <button
            onClick={() => navigate('/documents')}
            className="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-semibold"
          >
            Back to Documents Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleApprove = () => {
    verifyDocument(document.id, 'Verified', 'Approved by HR Administrator.');
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejecting the document.');
      return;
    }
    verifyDocument(document.id, 'Rejected', rejectReason);
    setShowRejectForm(false);
  };

  const handleRequestUpdate = () => {
    verifyDocument(document.id, 'Needs Update', 'HR requested document re-upload with clear scanning.');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${document.name} — Details`}
        breadcrumbs={[
          { label: 'Documents', path: '/documents' },
          { label: document.id, path: `/documents/${document.id}` },
        ]}
        actions={
          <button
            onClick={() => navigate('/documents')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <FiArrowLeft size={14} /> Back to Documents
          </button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Preview Frame & Metadata */}
        <div className="xl:col-span-2 space-y-6">
          {/* Document Header Hero Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0">
                <FiFileText size={28} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {document.name}
                  <VerificationBadge status={document.status} />
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {document.id} · {document.category} › {document.type} · {formatFileSize(document.sizeBytes)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                title="Print"
              >
                <FiPrinter size={16} />
              </button>
              <button
                onClick={() => alert(`Downloading ${document.name}...`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold"
              >
                <FiDownload size={14} /> Download
              </button>
            </div>
          </div>

          {/* Interactive Document Preview Placeholder */}
          <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center min-h-[280px] flex flex-col items-center justify-center space-y-3">
            <FiFileText size={48} className="text-violet-500 opacity-60" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Interactive Preview Window
            </p>
            <p className="text-xs text-slate-400 max-w-sm">
              Rendering full document preview for {document.name} ({document.format} format). Ready for Phase 2 Cloud Storage integration.
            </p>
          </div>

          {/* Version History Table */}
          <Card title="Version Timeline & Revision History">
            <div className="space-y-2 text-xs">
              {(document.versions || []).map((ver) => (
                <div key={ver.version} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 rounded">
                      v{ver.version}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{ver.name}</p>
                      <p className="text-slate-400 text-[11px]">
                        Uploaded {formatDateDDMMYYYY(ver.uploadDate)} by {ver.uploadedBy} ({formatFileSize(ver.sizeBytes)})
                      </p>
                    </div>
                  </div>
                  <button className="text-violet-600 font-semibold hover:underline">Download v{ver.version}</button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Workflow Verification & Employee Context */}
        <div className="space-y-6 text-xs">
          {/* HR Verification Workflow Box */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
              HR Verification Workflow
            </h3>

            {document.notes && (
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-400 block mb-0.5">Verification Notes:</span>
                <p>{document.notes}</p>
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={handleApprove}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm transition-all"
              >
                <FiCheckCircle size={16} /> Approve & Mark Verified
              </button>

              <button
                onClick={handleRequestUpdate}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-sm transition-all"
              >
                <FiAlertCircle size={16} /> Request Update / Re-upload
              </button>

              <button
                onClick={() => setShowRejectForm(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm transition-all"
              >
                <FiXCircle size={16} /> Reject Document
              </button>
            </div>

            {showRejectForm && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <label className="font-semibold text-rose-500 block">Reason for Rejection</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Document image is blurry or expired..."
                  className="w-full p-2 border border-rose-300 dark:border-rose-800 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white outline-none"
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowRejectForm(false)} className="px-3 py-1.5 text-slate-500">Cancel</button>
                  <button onClick={handleReject} className="px-4 py-1.5 bg-rose-600 text-white font-bold rounded-lg">Confirm Reject</button>
                </div>
              </div>
            )}
          </div>

          {/* Related Employee Summary */}
          <Card title="Related Employee Profile">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{document.employeeName}</p>
                  <p className="text-slate-400 font-mono">{document.employeeId}</p>
                </div>
                <button
                  onClick={() => navigate(`/employees/${document.employeeId}`)}
                  className="text-violet-600 font-semibold hover:underline"
                >
                  View Profile
                </button>
              </div>
              <p><span className="text-slate-400">Department:</span> <strong className="text-slate-800 dark:text-slate-200">{document.department}</strong></p>
              <p><span className="text-slate-400">Expiry Status:</span> <ExpiryBadge expiryDate={document.expiryDate} /></p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
