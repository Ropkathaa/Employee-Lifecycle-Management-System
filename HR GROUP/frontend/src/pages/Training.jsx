import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import TrainingStatsCards from '../components/training/TrainingStatsCards';
import TrainingFilters from '../components/training/TrainingFilters';
import TrainingTable from '../components/training/TrainingTable';
import TrainingCalendar from '../components/training/TrainingCalendar';
import ComplianceCard from '../components/training/ComplianceCard';
import TrainingAssignmentModal from '../components/training/TrainingAssignmentModal';
import TrainingWizardModal from '../components/training/TrainingWizardModal';
import CertificateCard from '../components/training/CertificateCard';
import { useTraining } from '../hooks/useTraining';
import { FiBookOpen, FiPlus, FiCalendar, FiShield, FiAward } from 'react-icons/fi';

export default function Training() {
  const navigate = useNavigate();
  const {
    programs,
    filteredPrograms,
    stats,
    compliance,
    certificates,
    filters,
    setFilters,
    resetFilters,
    createTraining,
    assignTraining,
  } = useTraining();

  const [activeTab, setActiveTab] = useState('catalog');
  const [page, setPage] = useState(1);
  const [activeAssignProgram, setActiveAssignProgram] = useState(null);
  const [showWizardModal, setShowWizardModal] = useState(false);

  const pageSize = 8;
  const totalPages = Math.ceil(filteredPrograms.length / pageSize) || 1;
  const paginatedPrograms = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPrograms.slice(start, start + pageSize);
  }, [filteredPrograms, page, pageSize]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Mandatory Training & Monitoring System"
        breadcrumbs={[{ label: 'Training Management', path: '/training' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="primary" onClick={() => setShowWizardModal(true)}>
              <FiPlus size={16} />
              <span>Create Program</span>
            </Button>
          </div>
        }
      />

      {/* Summary Statistics Cards */}
      <TrainingStatsCards stats={stats} />

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 text-xs font-bold">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-2.5 px-4 border-b-2 flex items-center gap-1.5 ${
            activeTab === 'catalog'
              ? 'border-violet-600 text-violet-600 dark:text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FiBookOpen size={14} /> Training Catalog & Roster
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`py-2.5 px-4 border-b-2 flex items-center gap-1.5 ${
            activeTab === 'calendar'
              ? 'border-violet-600 text-violet-600 dark:text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FiCalendar size={14} /> Training Calendar & Deadlines
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`py-2.5 px-4 border-b-2 flex items-center gap-1.5 ${
            activeTab === 'compliance'
              ? 'border-violet-600 text-violet-600 dark:text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FiShield size={14} /> Compliance & Certificates ({certificates.length})
        </button>
      </div>

      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <TrainingFilters
            filters={filters}
            onFilterChange={(newF) => { setFilters(newF); setPage(1); }}
            onReset={() => { resetFilters(); setPage(1); }}
            totalCount={programs.length}
            filteredCount={filteredPrograms.length}
          />

          <TrainingTable
            programs={paginatedPrograms}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onOpenAssignModal={(p) => setActiveAssignProgram(p)}
          />
        </div>
      )}

      {activeTab === 'calendar' && (
        <TrainingCalendar programs={programs} />
      )}

      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <ComplianceCard compliance={compliance} />
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
              <FiAward size={16} className="text-purple-600" /> Verified Employee Certificates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <CertificateCard key={cert.id} certificate={cert} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <TrainingAssignmentModal
        program={activeAssignProgram}
        isOpen={Boolean(activeAssignProgram)}
        onClose={() => setActiveAssignProgram(null)}
        onAssign={assignTraining}
      />

      <TrainingWizardModal
        isOpen={showWizardModal}
        onClose={() => setShowWizardModal(false)}
        onCreate={createTraining}
      />
    </div>
  );
}
