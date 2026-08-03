import React, { useState, useEffect, useMemo } from 'react';
import {
  FiSearch,
  FiX,
  FiEye,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiFileText,
  FiFile,
  FiAlertCircle,
  FiLoader,
  FiImage,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  DOCUMENT_TYPES,
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_TYPE_COLORS,
  DOCUMENT_STATUS,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_STATUS_COLORS,
  FORMAT_DATE,
  FORMAT_FILE_SIZE,
} from '../utils/constants';
import { classNames, truncateText } from '../utils/helpers';
import usePagination from '../hooks/usePagination';
import useDebounce from '../hooks/useDebounce';
import { employeeService } from '../services/employeeService';
import UploadDocumentsModal from '../components/UploadDocumentsModal';

// ===================================================================
// Helpers
// ===================================================================
const isImage = (doc) => (doc.mimeType || '').startsWith('image/');
const isPdf = (doc) => (doc.mimeType || '') === 'application/pdf';

const getSortValue = (doc, field) => {
  switch (field) {
    case 'name':
      return doc.documentName || '';
    case 'type':
      return doc.documentType || '';
    case 'size':
      return doc.fileSize || 0;
    case 'status':
      return doc.status || '';
    case 'uploadDate':
      return doc.createdAt || '';
    default:
      return doc.createdAt || '';
  }
};

// ===================================================================
// Documents Component
// ===================================================================
const Documents = () => {
  // --------------- Data ---------------
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------- Search & Filters ---------------
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // --------------- Sorting ---------------
  const [sortField, setSortField] = useState('uploadDate');
  const [sortDirection, setSortDirection] = useState('desc');

  // --------------- Modals ---------------
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [highlightDocType, setHighlightDocType] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // --------------- Delete state ---------------
  const [deleting, setDeleting] = useState(false);

  // Fetch documents from backend on mount
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await employeeService.getDocuments({ page: 1, limit: 1000 });
      setDocuments(response.data?.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // --------------- Filtered + Sorted Data ---------------
  const processedDocuments = useMemo(() => {
    let result = [...documents];

    // Search by document name
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (d) =>
          (d.documentName || '').toLowerCase().includes(q) ||
          (d.originalName || '').toLowerCase().includes(q)
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter((d) => d.documentType === filterType);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter((d) => d.status === filterStatus);
    }

    // Sort
    result.sort((a, b) => {
      const aVal = getSortValue(a, sortField);
      const bVal = getSortValue(b, sortField);
      let cmp;
      if (typeof aVal === 'string') {
        cmp = aVal.localeCompare(bVal);
      } else {
        cmp = aVal - bVal;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [documents, debouncedSearch, filterType, filterStatus, sortField, sortDirection]);

  // --------------- Pagination ---------------
  const itemsPerPage = 8;
  const { currentPage, totalPages, paginatedData, goToPage, nextPage, prevPage } =
    usePagination(processedDocuments, itemsPerPage);

  // --------------- Summary Stats ---------------
  const summary = useMemo(() => {
    const total = documents.length;
    const uploaded = documents.filter(
      (d) => d.status === DOCUMENT_STATUS.UPLOADED || d.status === DOCUMENT_STATUS.APPROVED
    ).length;
    const pending = documents.filter((d) => d.status === DOCUMENT_STATUS.PENDING).length;
    const expired = documents.filter((d) => d.status === DOCUMENT_STATUS.EXPIRED).length;
    return { total, uploaded, pending, expired };
  }, [documents]);

  // --------------- Sort handlers ---------------
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <FiChevronUp className="w-3.5 h-3.5 inline-block ml-1" />
    ) : (
      <FiChevronDown className="w-3.5 h-3.5 inline-block ml-1" />
    );
  };

  // --------------- Modal open helpers ---------------
  const openUploadModal = (highlightType = '') => {
    setHighlightDocType(highlightType || '');
    setShowUploadModal(true);
  };

  const openViewModal = (doc) => {
    setSelectedDoc(doc);
    setShowViewModal(true);
  };

  const openDeleteConfirm = (doc) => {
    setSelectedDoc(doc);
    setShowDeleteConfirm(true);
  };

  // --------------- Actions ---------------
  const handleDelete = async () => {
    if (!selectedDoc) return;
    setDeleting(true);
    try {
      await employeeService.deleteDocument(selectedDoc._id);
      setDocuments((prev) => prev.filter((d) => d._id !== selectedDoc._id));
      setShowDeleteConfirm(false);
      setSelectedDoc(null);
      toast.success('Document deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete document');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = (doc) => {
    const url = employeeService.getDocumentDownloadUrl(doc._id);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleUploadSuccess = () => {
    fetchDocuments();
  };

  // =================================================================
  // RENDER
  // =================================================================
  return (
    <div className="space-y-6">
      {/* ---------- Header ---------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500 mt-1">Manage and track employee documents</p>
        </div>
        <button
          onClick={() => openUploadModal()}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <FiUpload className="w-4 h-4" />
          Upload Documents
        </button>
      </div>

      {/* ---------- Summary Cards ---------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-sm text-gray-500">Total Documents</p>
          <p className="text-2xl font-bold mt-2 text-gray-900">{summary.total}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Uploaded Documents</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{summary.uploaded}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Pending Documents</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">{summary.pending}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Expired Documents</p>
          <p className="text-2xl font-bold text-red-600 mt-2">{summary.expired}</p>
        </div>
      </div>

      {/* ---------- Search & Filters ---------- */}
      <div className="card">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by document name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field"
          >
            <option value="all">All Types</option>
            {Object.values(DOCUMENT_TYPES).map((t) => (
              <option key={t} value={t}>
                {DOCUMENT_TYPE_LABELS[t]}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            {Object.values(DOCUMENT_STATUS).map((s) => (
              <option key={s} value={s}>
                {DOCUMENT_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        {/* Active filters indicator */}
        {(filterType !== 'all' || filterStatus !== 'all' || debouncedSearch) && (
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <FiAlertCircle className="w-3.5 h-3.5" />
            <span>Filters active</span>
            <button
              onClick={() => {
                setFilterType('all');
                setFilterStatus('all');
                setSearchTerm('');
              }}
              className="text-primary-600 hover:text-primary-700 underline ml-1"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ---------- Documents Table ---------- */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <Th sortable onClick={() => handleSort('name')}>
                  Document Name <SortIcon field="name" />
                </Th>
                <Th sortable onClick={() => handleSort('type')}>
                  Document Type <SortIcon field="type" />
                </Th>
                <Th sortable onClick={() => handleSort('uploadDate')}>
                  Upload Date <SortIcon field="uploadDate" />
                </Th>
                <Th sortable onClick={() => handleSort('size')}>
                  File Size <SortIcon field="size" />
                </Th>
                <Th sortable onClick={() => handleSort('status')}>
                  Status <SortIcon field="status" />
                </Th>
                <Th className="relative">
                  <span className="sr-only">Actions</span>
                </Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <FiLoader className="w-5 h-5 text-primary-600 animate-spin" />
                      <span>Loading documents...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FiFileText className="w-10 h-10 text-gray-300" />
                      <p className="text-gray-500 font-medium">
                        {documents.length === 0
                          ? 'No documents uploaded yet'
                          : 'No documents match your filters'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {documents.length === 0
                          ? 'Click "Upload Documents" to add your documents.'
                          : 'Try adjusting your search or filters.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((doc) => (
                  <tr key={doc._id} className="hover:bg-gray-50 transition-colors">
                    {/* Document Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={classNames(
                            'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                            isImage(doc)
                              ? 'bg-purple-100 text-purple-600'
                              : isPdf(doc)
                              ? 'bg-red-100 text-red-600'
                              : 'bg-blue-100 text-blue-600'
                          )}
                        >
                          {isImage(doc) ? (
                            <FiImage className="w-4 h-4" />
                          ) : isPdf(doc) ? (
                            <FiFileText className="w-4 h-4" />
                          ) : (
                            <FiFile className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {doc.documentName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {truncateText(doc.originalName, 30)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Document Type */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={classNames(
                          'px-2.5 py-1 rounded-full text-xs font-medium inline-block',
                          DOCUMENT_TYPE_COLORS[doc.documentType] || 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {DOCUMENT_TYPE_LABELS[doc.documentType] ||
                          doc.documentType.charAt(0).toUpperCase() + doc.documentType.slice(1)}
                      </span>
                    </td>

                    {/* Upload Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {FORMAT_DATE(doc.createdAt)}
                    </td>

                    {/* File Size */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {FORMAT_FILE_SIZE(doc.fileSize)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={classNames(
                          'px-2.5 py-1 rounded-full text-xs font-medium',
                          DOCUMENT_STATUS_COLORS[doc.status] || 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {DOCUMENT_STATUS_LABELS[doc.status] ||
                          doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <ActionButton
                          title="Replace Document"
                          onClick={() => openUploadModal(doc.documentType)}
                          className="hover:text-blue-600 hover:bg-blue-50"
                        >
                          <FiUpload className="w-4 h-4" />
                        </ActionButton>
                        <ActionButton
                          title="View"
                          onClick={() => openViewModal(doc)}
                          className="hover:text-indigo-600 hover:bg-indigo-50"
                        >
                          <FiEye className="w-4 h-4" />
                        </ActionButton>
                        <ActionButton
                          title="Download"
                          onClick={() => handleDownload(doc)}
                          className="hover:text-green-600 hover:bg-green-50"
                        >
                          <FiDownload className="w-4 h-4" />
                        </ActionButton>
                        <ActionButton
                          title="Replace"
                          onClick={() => openUploadModal(doc.documentType)}
                          className="hover:text-orange-600 hover:bg-orange-50"
                        >
                          <FiRefreshCw className="w-4 h-4" />
                        </ActionButton>
                        <ActionButton
                          title="Delete"
                          onClick={() => openDeleteConfirm(doc)}
                          className="hover:text-red-600 hover:bg-red-50"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ---------- Pagination ---------- */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, processedDocuments.length)} of{' '}
              {processedDocuments.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={classNames(
                    'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* UPLOAD DOCUMENTS MODAL */}
      {/* ================================================================ */}
      <UploadDocumentsModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        existingDocuments={documents}
        highlightType={highlightDocType}
        onSuccess={handleUploadSuccess}
      />

      {/* ================================================================ */}
      {/* VIEW MODAL */}
      {/* ================================================================ */}
      {showViewModal && selectedDoc && (
        <ModalOverlay onClose={() => setShowViewModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <ModalHeader
              title={selectedDoc.documentName}
              onClose={() => setShowViewModal(false)}
            />
            <div className="p-6 space-y-4">
              {/* File Preview */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                {isImage(selectedDoc) ? (
                  <div className="flex items-center justify-center p-3 bg-white">
                    <img
                      src={employeeService.getDocumentDownloadUrl(selectedDoc._id, true)}
                      alt={selectedDoc.documentName}
                      className="max-h-80 max-w-full rounded object-contain"
                    />
                  </div>
                ) : isPdf(selectedDoc) ? (
                  <iframe
                    src={employeeService.getDocumentDownloadUrl(selectedDoc._id, true)}
                    title={selectedDoc.documentName}
                    className="w-full h-80 bg-white"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 p-8">
                    <FiFileText className="w-16 h-16 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Preview not available for this file type
                    </p>
                    <button
                      onClick={() => handleDownload(selectedDoc)}
                      className="btn-primary flex items-center gap-2 mt-2"
                    >
                      <FiDownload className="w-4 h-4" />
                      Download File
                    </button>
                  </div>
                )}
              </div>

              {/* Document Details */}
              <div className="grid grid-cols-2 gap-4">
                <DetailRow
                  label="Document Type"
                  value={
                    <span
                      className={classNames(
                        'px-2.5 py-1 rounded-full text-xs font-medium inline-block',
                        DOCUMENT_TYPE_COLORS[selectedDoc.documentType] || 'bg-gray-100 text-gray-800'
                      )}
                    >
                      {DOCUMENT_TYPE_LABELS[selectedDoc.documentType] ||
                        selectedDoc.documentType.charAt(0).toUpperCase() + selectedDoc.documentType.slice(1)}
                    </span>
                  }
                />
                <DetailRow
                  label="Status"
                  value={
                    <span
                      className={classNames(
                        'px-2.5 py-1 rounded-full text-xs font-medium inline-block',
                        DOCUMENT_STATUS_COLORS[selectedDoc.status] || 'bg-gray-100 text-gray-800'
                      )}
                    >
                      {DOCUMENT_STATUS_LABELS[selectedDoc.status] ||
                        selectedDoc.status.charAt(0).toUpperCase() + selectedDoc.status.slice(1)}
                    </span>
                  }
                />
                <DetailRow label="File Name" value={selectedDoc.originalName} />
                <DetailRow label="File Size" value={FORMAT_FILE_SIZE(selectedDoc.fileSize)} />
                <DetailRow label="Upload Date" value={FORMAT_DATE(selectedDoc.createdAt)} />
                <DetailRow label="Last Updated" value={FORMAT_DATE(selectedDoc.updatedAt)} />
                {selectedDoc.expiresAt && (
                  <DetailRow label="Expires At" value={FORMAT_DATE(selectedDoc.expiresAt)} />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between px-6 pb-6">
              <button
                onClick={() => handleDownload(selectedDoc)}
                className="btn-secondary flex items-center gap-2"
              >
                <FiDownload className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* ================================================================ */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ================================================================ */}
      {showDeleteConfirm && selectedDoc && (
        <ModalOverlay onClose={() => !deleting && setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <FiAlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Document
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Are you sure you want to delete{' '}
                <span className="font-medium">{selectedDoc.documentName}</span>?
              </p>
              <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1 text-gray-700">
                <p>
                  <span className="font-medium">Type:</span>{' '}
                  {DOCUMENT_TYPE_LABELS[selectedDoc.documentType] || selectedDoc.documentType}
                </p>
                <p>
                  <span className="font-medium">File:</span> {selectedDoc.originalName}
                </p>
                <p>
                  <span className="font-medium">Size:</span> {FORMAT_FILE_SIZE(selectedDoc.fileSize)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 pb-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger flex items-center gap-2"
                disabled={deleting}
              >
                {deleting && <FiLoader className="w-4 h-4 animate-spin" />}
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
};

// ===================================================================
// Sub-components
// ===================================================================

const Th = ({ children, sortable, onClick, className }) => (
  <th
    className={classNames(
      'text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider',
      sortable && 'cursor-pointer select-none hover:text-gray-700',
      className
    )}
    onClick={sortable ? onClick : undefined}
  >
    {children}
  </th>
);

const ActionButton = ({ children, title, onClick, className }) => (
  <button
    title={title}
    onClick={onClick}
    className={classNames(
      'p-1.5 rounded-lg transition-colors text-gray-400',
      className
    )}
  >
    {children}
  </button>
);

const ModalOverlay = ({ children, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    onClick={onClose}
  >
    <div onClick={(e) => e.stopPropagation()}>{children}</div>
  </div>
);

const ModalHeader = ({ title, onClose }) => (
  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    <button
      onClick={onClose}
      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <FiX className="w-5 h-5 text-gray-500" />
    </button>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-gray-500">{label}</span>
    <span className="text-sm text-gray-900 break-words">{value || '—'}</span>
  </div>
);

export default Documents;

