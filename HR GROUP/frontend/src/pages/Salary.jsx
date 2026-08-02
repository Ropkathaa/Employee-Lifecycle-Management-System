import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import SalaryStatsCards from '../components/salary/SalaryStatsCards';
import SalaryFilters from '../components/salary/SalaryFilters';
import SalaryTable from '../components/salary/SalaryTable';
import SalaryAnalyticsCards from '../components/salary/SalaryAnalyticsCards';
import SalaryRevisionModal from '../components/salary/SalaryRevisionModal';
import { useSalary } from '../hooks/useSalary';
import { FiDollarSign, FiEdit3, FiPieChart, FiShield } from 'react-icons/fi';

export default function Salary() {
  const navigate = useNavigate();
  const {
    salaryRecords,
    filteredRecords,
    stats,
    departmentAnalytics,
    filters,
    setFilters,
    resetFilters,
    reviseSalary,
  } = useSalary();

  const [page, setPage] = useState(1);
  const [activeReviseRecord, setActiveReviseRecord] = useState(null);
  const pageSize = 8;

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, page, pageSize]);

  const handleRevisionSubmit = (employeeId, revisionInput, reason) => {
    reviseSalary(employeeId, revisionInput, reason);
    setActiveReviseRecord(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Salary Summary & PF Management"
        breadcrumbs={[{ label: 'Salary Summary', path: '/salary' }]}
        actions={
          <Button variant="primary" onClick={() => setActiveReviseRecord(salaryRecords[0] || null)}>
            <FiEdit3 size={16} />
            <span>Revise Salary Package</span>
          </Button>
        }
      />

      {/* Summary Stats */}
      <SalaryStatsCards stats={stats} />

      {/* Department Analytics Cards */}
      <SalaryAnalyticsCards analytics={departmentAnalytics} />

      {/* Filter Bar */}
      <SalaryFilters
        filters={filters}
        onFilterChange={(newF) => { setFilters(newF); setPage(1); }}
        onReset={() => { resetFilters(); setPage(1); }}
        totalCount={salaryRecords.length}
        filteredCount={filteredRecords.length}
      />

      {/* Salary Roster Table */}
      <SalaryTable
        records={paginatedRecords}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onOpenReviseModal={(rec) => setActiveReviseRecord(rec)}
      />

      {/* Salary Revision Modal */}
      <SalaryRevisionModal
        record={activeReviseRecord}
        isOpen={Boolean(activeReviseRecord)}
        onClose={() => setActiveReviseRecord(null)}
        onSubmitRevision={handleRevisionSubmit}
      />
    </div>
  );
}
