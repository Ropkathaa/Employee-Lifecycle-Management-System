import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import EmployeeFilters from '../components/employee/EmployeeFilters';
import EmployeeTable from '../components/employee/EmployeeTable';
import EmployeeCard from '../components/employee/EmployeeCard';
import { useEmployees } from '../hooks/useEmployees';
import { FiPlus, FiGrid, FiList } from 'react-icons/fi';

export default function Employees() {
  const navigate = useNavigate();
  const { employees, filteredEmployees, filters, setFilters, resetFilters } = useEmployees();
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Sort & Select States
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Pagination slicing
  const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;
  const paginatedEmployees = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, page, pageSize]);

  // Handlers
  const handleSort = (field) => {
    if (filters.sortField === field) {
      setFilters({ sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc' });
    } else {
      setFilters({ sortField: field, sortDirection: 'asc' });
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredEmployees.map((e) => e.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Employee Roster"
        breadcrumbs={[{ label: 'Employees', path: '/employees' }]}
        actions={
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Table View"
              >
                <FiList size={16} /> Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Grid View"
              >
                <FiGrid size={16} /> Grid
              </button>
            </div>

            {/* Create CTA */}
            <Button variant="primary" onClick={() => navigate('/employees/create')}>
              <FiPlus size={16} />
              <span>Create Employee</span>
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <EmployeeFilters
        searchTerm={filters.searchTerm}
        onSearchChange={(val) => { setFilters({ searchTerm: val }); setPage(1); }}
        department={filters.department}
        onDepartmentChange={(val) => { setFilters({ department: val }); setPage(1); }}
        status={filters.status}
        onStatusChange={(val) => { setFilters({ status: val }); setPage(1); }}
        employmentType={filters.employmentType}
        onEmploymentTypeChange={(val) => { setFilters({ employmentType: val }); setPage(1); }}
        onReset={() => { resetFilters(); setPage(1); }}
        totalCount={employees.length}
        filteredCount={filteredEmployees.length}
      />

      {/* Main Content: Table or Grid */}
      {viewMode === 'table' ? (
        <EmployeeTable
          employees={paginatedEmployees}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          sortField={filters.sortField}
          sortDirection={filters.sortDirection}
          onSort={handleSort}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedEmployees.map((emp) => (
              <EmployeeCard key={emp.id} employee={emp} />
            ))}
          </div>

          {/* Grid View Pagination Footer */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500">
            <span>Page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
