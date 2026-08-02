import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import DocumentStatsCards from '../components/document/DocumentStatsCards';
import DocumentFilters from '../components/document/DocumentFilters';
import DocumentTable from '../components/document/DocumentTable';
import DocumentPreviewModal from '../components/document/DocumentPreviewModal';
import { useDocuments } from '../hooks/useDocuments';
import { FiPlus, FiUploadCloud, FiCheckSquare, FiPieChart } from 'react-icons/fi';

export default function Documents() {
  const navigate = useNavigate();
  const {
    documents,
    filteredDocuments,
    stats,
    filters,
    setFilters,
    resetFilters,
    deleteDocument,
    previewModalDoc,
    openPreviewModal,
    closePreviewModal,
  } = useDocuments();

  const [page, setPage] = useState(1);
  const pageSize = 8;

  const totalPages = Math.ceil(filteredDocuments.length / pageSize) || 1;
  const paginatedDocuments = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredDocuments.slice(start, start + pageSize);
  }, [filteredDocuments, page, pageSize]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Employee Documents Dashboard"
        breadcrumbs={[{ label: 'Documents', path: '/documents' }]}
        actions={
          <Button variant="primary" onClick={() => navigate('/documents/upload')}>
            <FiUploadCloud size={16} />
            <span>Upload Document</span>
          </Button>
        }
      />

      {/* Summary Stats Cards */}
      <DocumentStatsCards stats={stats} />

      {/* Quick Action Navigation Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/documents/upload')}
          className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-500 text-left flex items-center justify-between shadow-sm transition-all group"
        >
          <div>
            <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-violet-600">
              Upload New Documents
            </p>
            <p className="text-[11px] text-slate-400">Drag & drop files with instant validation</p>
          </div>
          <FiUploadCloud className="text-violet-500 group-hover:scale-110 transition-transform" size={20} />
        </button>

        <button
          onClick={() => setFilters({ status: 'Pending' })}
          className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-left flex items-center justify-between shadow-sm transition-all group"
        >
          <div>
            <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-600">
              Review Pending Files ({stats.pending})
            </p>
            <p className="text-[11px] text-slate-400">Verify onboarding compliance docs</p>
          </div>
          <FiCheckSquare className="text-amber-500 group-hover:scale-110 transition-transform" size={20} />
        </button>

        <button
          onClick={() => setFilters({ status: 'Expired' })}
          className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-500 text-left flex items-center justify-between shadow-sm transition-all group"
        >
          <div>
            <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-rose-600">
              Expired & Expiring ({stats.expired + stats.expiringSoon})
            </p>
            <p className="text-[11px] text-slate-400">Track upcoming document renewals</p>
          </div>
          <FiPieChart className="text-rose-500 group-hover:scale-110 transition-transform" size={20} />
        </button>
      </div>

      {/* Filter Bar */}
      <DocumentFilters
        filters={filters}
        onFilterChange={(newF) => { setFilters(newF); setPage(1); }}
        onReset={() => { resetFilters(); setPage(1); }}
        totalCount={documents.length}
        filteredCount={filteredDocuments.length}
      />

      {/* Main Document Table */}
      <DocumentTable
        documents={paginatedDocuments}
        onPreview={openPreviewModal}
        onDelete={deleteDocument}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Preview Modal */}
      <DocumentPreviewModal
        document={previewModalDoc}
        isOpen={Boolean(previewModalDoc)}
        onClose={closePreviewModal}
      />
    </div>
  );
}
