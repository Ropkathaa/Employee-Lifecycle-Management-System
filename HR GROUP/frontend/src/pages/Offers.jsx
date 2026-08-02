import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import OfferStatsCards from '../components/offer/OfferStatsCards';
import OfferFilters from '../components/offer/OfferFilters';
import OfferTable from '../components/offer/OfferTable';
import OfferPreviewModal from '../components/offer/OfferPreviewModal';
import { useOffers } from '../hooks/useOffers';
import { FiPlus, FiFileText, FiClock, FiCheckCircle } from 'react-icons/fi';

export default function Offers() {
  const navigate = useNavigate();
  const {
    offers,
    filteredOffers,
    stats,
    filters,
    setFilters,
    resetFilters,
    previewModalOffer,
    openPreviewModal,
    closePreviewModal,
  } = useOffers();

  const [page, setPage] = useState(1);
  const pageSize = 8;

  const totalPages = Math.ceil(filteredOffers.length / pageSize) || 1;
  const paginatedOffers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredOffers.slice(start, start + pageSize);
  }, [filteredOffers, page, pageSize]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Offer Packet Management"
        breadcrumbs={[{ label: 'Offers', path: '/offers' }]}
        actions={
          <Button variant="primary" onClick={() => navigate('/offers/create')}>
            <FiPlus size={16} />
            <span>Generate Offer Packet</span>
          </Button>
        }
      />

      {/* Summary Stats */}
      <OfferStatsCards stats={stats} />

      {/* Quick Action Navigation Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/offers/create')}
          className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-500 text-left flex items-center justify-between shadow-sm transition-all group cursor-pointer"
        >
          <div>
            <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-violet-600">
              Generate New Offer
            </p>
            <p className="text-[11px] text-slate-400">Multi-step wizard with CTC breakdown</p>
          </div>
          <FiPlus className="text-violet-500 group-hover:scale-110 transition-transform" size={20} />
        </button>

        <button
          onClick={() => setFilters({ status: 'Pending Approval' })}
          className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-left flex items-center justify-between shadow-sm transition-all group cursor-pointer"
        >
          <div>
            <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-600">
              Pending Approvals ({stats.pending})
            </p>
            <p className="text-[11px] text-slate-400">Review candidate salary packets</p>
          </div>
          <FiClock className="text-amber-500 group-hover:scale-110 transition-transform" size={20} />
        </button>

        <button
          onClick={() => setFilters({ status: 'Approved' })}
          className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-left flex items-center justify-between shadow-sm transition-all group cursor-pointer"
        >
          <div>
            <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600">
              Approved Offers ({stats.approved})
            </p>
            <p className="text-[11px] text-slate-400">Ready for dispatch & signature</p>
          </div>
          <FiCheckCircle className="text-emerald-500 group-hover:scale-110 transition-transform" size={20} />
        </button>
      </div>

      {/* Filter Bar */}
      <OfferFilters
        filters={filters}
        onFilterChange={(newF) => { setFilters(newF); setPage(1); }}
        onReset={() => { resetFilters(); setPage(1); }}
        totalCount={offers.length}
        filteredCount={filteredOffers.length}
      />

      {/* Offer Table */}
      <OfferTable
        offers={paginatedOffers}
        onPreview={openPreviewModal}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Preview Modal */}
      <OfferPreviewModal
        offer={previewModalOffer}
        isOpen={Boolean(previewModalOffer)}
        onClose={closePreviewModal}
      />
    </div>
  );
}
