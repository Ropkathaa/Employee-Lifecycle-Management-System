import React, { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiX,
  FiUpload,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiTrash2,
  FiRefreshCw,
  FiLock,
} from 'react-icons/fi';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS } from '../utils/constants';
import { classNames } from '../utils/helpers';
import { employeeService } from '../services/employeeService';

// ===================================================================
// Document checklist definitions
// ===================================================================
const MANDATORY_DOCS = [
  { type: DOCUMENT_TYPES.AADHAAR_CARD, required: true, errorMessage: 'Aadhaar Card is required.' },
  { type: DOCUMENT_TYPES.PAN_CARD, required: true, errorMessage: 'Please upload your PAN Card.' },
  { type: DOCUMENT_TYPES.PASSPORT_PHOTO, required: true, errorMessage: 'Please upload your Passport Size Photo.' },
  { type: DOCUMENT_TYPES.TENTH_MARKSHEET, required: true, errorMessage: 'Please upload your 10th Marksheet.' },
  { type: DOCUMENT_TYPES.TWELFTH_MARKSHEET, required: true, errorMessage: 'Please upload your 12th Marksheet.' },
  { type: DOCUMENT_TYPES.GRADUATION_CERTIFICATE, required: true, errorMessage: 'Please upload your Graduation Certificate.' },
  { type: DOCUMENT_TYPES.RESUME, required: true, errorMessage: 'Please upload your Resume.' },
];

const OPTIONAL_DOCS = [
  { type: DOCUMENT_TYPES.PASSPORT, required: false },
  { type: DOCUMENT_TYPES.EXPERIENCE_CERTIFICATES, required: false },
  { type: DOCUMENT_TYPES.POST_GRADUATION_CERTIFICATE, required: false },
  { type: DOCUMENT_TYPES.ADDITIONAL_DOCUMENTS, required: false },
];

const ALL_DOCS = [...MANDATORY_DOCS, ...OPTIONAL_DOCS];

const ACCEPT = '.jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.txt';

// ===================================================================
// Helpers
// ===================================================================
const isValidFile = (file) => {
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'];
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (!allowedExtensions.includes(ext)) return { ok: false, message: 'Invalid file type. Allowed: JPG, PNG, GIF, WEBP, PDF, DOC, DOCX, XLS, XLSX, TXT' };
  if (file.size > 5 * 1024 * 1024) return { ok: false, message: 'File size must be less than 5MB' };
  return { ok: true };
};

// ===================================================================
// UploadDocumentsModal Component
// ===================================================================
const UploadDocumentsModal = ({ open, onClose, existingDocuments = [], onSuccess, highlightType }) => {
  const [files, setFiles] = useState({}); // { [documentType]: File }
  const [errors, setErrors] = useState({}); // { [documentType]: errorMessage }
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const bodyRef = useRef(null);

  // Map existing documents by type
  const existingByType = useMemo(() => {
    const map = {};
    existingDocuments.forEach((doc) => {
      if (!map[doc.documentType]) map[doc.documentType] = doc;
    });
    return map;
  }, [existingDocuments]);

  // Is a document considered "already uploaded"?
  const isSatisfiedByExisting = (type) => {
    const doc = existingByType[type];
    if (!doc) return false;
    return ![DOCUMENT_STATUS.REJECTED, DOCUMENT_STATUS.EXPIRED].includes(doc.status);
  };

  const hasFile = (type) => Boolean(files[type]);

  const isDocSatisfied = (type) => isSatisfiedByExisting(type) || hasFile(type);

  const requiredSatisfiedCount = useMemo(
    () => MANDATORY_DOCS.filter((d) => isDocSatisfied(d.type)).length,
    [files, existingByType]
  );

  // Reset state whenever the modal opens
  useEffect(() => {
    if (open) {
      setFiles({});
      setErrors({});
      setProgress(0);
      setUploadedCount(0);
    }
  }, [open]);

  // Scroll the highlighted document into view
  useEffect(() => {
    if (open && highlightType && bodyRef.current) {
      const el = bodyRef.current.querySelector(`[data-doc-type="${highlightType}"]`);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
        el.classList.add('ring-2', 'ring-primary-400', 'ring-offset-2');
        setTimeout(() => el.classList.remove('ring-2', 'ring-primary-400', 'ring-offset-2'), 2400);
      }
    }
  }, [open, highlightType]);

  if (!open) return null;

  // --------------- Handlers ---------------
  const handleFileChange = (type, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const check = isValidFile(file);
    if (!check.ok) {
      toast.error(check.message);
      e.target.value = '';
      return;
    }

    setFiles((prev) => ({ ...prev, [type]: file }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
  };

  const handleRemoveFile = (type) => {
    setFiles((prev) => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
  };

  const validate = () => {
    const nextErrors = {};
    MANDATORY_DOCS.forEach((d) => {
      if (!isDocSatisfied(d.type)) {
        nextErrors[d.type] = d.errorMessage;
      }
    });
    setErrors(nextErrors);
    return nextErrors;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      toast.error('Please upload all required documents before submitting.');
      // Scroll to first error
      const firstErrorType = MANDATORY_DOCS.find((d) => nextErrors[d.type])?.type;
      if (firstErrorType && bodyRef.current) {
        const el = bodyRef.current.querySelector(`[data-doc-type="${firstErrorType}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Build payload — only documents with a newly selected file are uploaded
    const selectedDocs = ALL_DOCS.filter((d) => hasFile(d.type));
    if (selectedDocs.length === 0) {
      toast.error('Please choose at least one file to upload.');
      return;
    }

    const formData = new FormData();
    selectedDocs.forEach((d) => {
      formData.append('files', files[d.type]);
    });
    formData.append(
      'documents',
      JSON.stringify(
        selectedDocs.map((d) => ({
          documentType: d.type,
          documentName: DOCUMENT_TYPE_LABELS[d.type],
          documentId: existingByType[d.type]?._id || undefined,
        }))
      )
    );

    setSubmitting(true);
    setProgress(0);
    setUploadedCount(0);

    try {
      const response = await employeeService.bulkUploadDocuments(formData, (e) => {
        if (e.total) {
          const pct = Math.round((e.loaded / e.total) * 100);
          setProgress(pct);
          setUploadedCount(Math.min(selectedDocs.length, Math.round((pct / 100) * selectedDocs.length)));
        }
      });

      toast.success('All documents uploaded successfully.');
      onSuccess?.();
      onClose?.();
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // --------------- Rendering helpers ---------------
  const DocumentCard = ({ doc }) => {
    const type = doc.type;
    const existingDoc = existingByType[type];
    const file = files[type];
    const error = errors[type];
    const isExisting = isSatisfiedByExisting(type);
    const isSelected = Boolean(file);

    const statusLabel = isSelected || isExisting ? 'Uploaded' : 'Not Uploaded';
    const statusColor = isSelected || isExisting
      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      : 'bg-gray-100 text-gray-500 border border-gray-200';

    return (
      <div
        data-doc-type={type}
        className={classNames(
          'rounded-xl border p-4 transition-all duration-300 bg-white',
          error ? 'border-red-300 bg-red-50/40' : isSelected ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 hover:border-gray-300'
        )}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left: icon + label + file name */}
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={classNames(
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                isSelected || isExisting ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'
              )}
            >
              {isSelected || isExisting ? <FiCheckCircle className="w-5 h-5" /> : <FiFileText className="w-5 h-5" />}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-900">
                  {DOCUMENT_TYPE_LABELS[type]}
                </span>
                {doc.required ? (
                  <span className="text-red-500 font-bold">*</span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-gray-100 text-gray-500 border border-gray-200">
                    Optional
                  </span>
                )}
              </div>

              {/* File name / status text */}
              <div className="mt-1 flex items-center gap-1.5 min-w-0">
                {isSelected ? (
                  <>
                    <FiFileText className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <p className="text-sm text-emerald-700 font-medium truncate">{file.name}</p>
                  </>
                ) : isExisting ? (
                  <>
                    <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <p className="text-sm text-emerald-700 truncate">
                      {existingDoc.originalName || 'Already uploaded'}
                    </p>
                  </>
                ) : (
                  <>
                    <FiFileText className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                    <p className="text-sm text-gray-400">No file selected</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: status badge */}
          <span
            className={classNames(
              'px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0',
              statusColor
            )}
          >
            {isSelected || isExisting ? '✓ Uploaded' : '✗ Not Uploaded'}
          </span>
        </div>

        {/* File controls */}
        <div className="mt-3 flex items-center gap-2 pl-[52px] flex-wrap">
          <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <FiUpload className="w-4 h-4 text-gray-500" />
            {isSelected ? 'Replace File' : isExisting ? 'Replace File' : 'Choose File'}
            <input
              type="file"
              accept={ACCEPT}
              className="hidden"
              disabled={submitting}
              onChange={(e) => handleFileChange(type, e)}
            />
          </label>

          {isSelected && (
            <>
              <span className="text-xs text-gray-400 truncate max-w-[160px]">{file.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveFile(type)}
                disabled={submitting}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </>
          )}

          {isExisting && !isSelected && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500">
              <FiRefreshCw className="w-3.5 h-3.5" />
              Existing file will be kept unless replaced
            </span>
          )}
        </div>

        {/* Validation message */}
        {error && (
          <p className="mt-2 pl-[52px] flex items-center gap-1.5 text-xs font-medium text-red-600 animate-fade-slide">
            <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  };

  const renderDocList = (docs) => (
    <div className="space-y-3">
      {docs.map((doc) => (
        <DocumentCard key={doc.type} doc={doc} />
      ))}
    </div>
  );

  const totalSelected = ALL_DOCS.filter((d) => hasFile(d.type)).length;
  const allRequiredFilled = requiredSatisfiedCount === MANDATORY_DOCS.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-modal-overlay"
      onClick={() => !submitting && onClose?.()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[92vh] overflow-hidden animate-modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---------- Header ---------- */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Upload Documents</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Upload all required and optional documents in one go
            </p>
          </div>
          <button
            onClick={() => !submitting && onClose?.()}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* ---------- Scrollable Body ---------- */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Info banner */}
          <div className="flex items-start gap-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <FiLock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                {requiredSatisfiedCount} of {MANDATORY_DOCS.length} mandatory documents complete
              </p>
              <p className="text-xs text-blue-700 mt-0.5">
                Documents marked with <span className="text-red-500 font-bold">*</span> are mandatory. Files must be
                under 5MB (JPG, PNG, PDF, DOC, DOCX).
              </p>
            </div>
          </div>

          {/* Mandatory section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Mandatory Documents
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                {MANDATORY_DOCS.length} required
              </span>
            </div>
            {renderDocList(MANDATORY_DOCS)}
          </section>

          {/* Optional section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Optional Documents
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                Optional
              </span>
            </div>
            {renderDocList(OPTIONAL_DOCS)}
          </section>

          {/* Upload progress */}
          {submitting && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 space-y-2 animate-fade-slide">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-blue-700 flex items-center gap-2">
                  <FiLoader className="w-3.5 h-3.5 animate-spin" />
                  Uploading {uploadedCount} of {totalSelected} document{totalSelected > 1 ? 's' : ''}...
                </span>
                <span className="text-xs font-semibold text-blue-700">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ---------- Footer ---------- */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/60 flex items-center justify-between gap-4">
          <p className="text-xs text-gray-500 hidden sm:block">
            {allRequiredFilled
              ? 'All mandatory documents are ready.'
              : `${MANDATORY_DOCS.length - requiredSatisfiedCount} mandatory document${
                  MANDATORY_DOCS.length - requiredSatisfiedCount > 1 ? 's' : ''
                } remaining.`}
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => !submitting && onClose?.()}
              className="btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary flex items-center gap-2"
            >
              {submitting ? (
                <FiLoader className="w-4 h-4 animate-spin" />
              ) : (
                <FiUpload className="w-4 h-4" />
              )}
              {submitting ? 'Uploading...' : 'Upload All Documents'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentsModal;

