import React, { createContext, useState, useEffect, useMemo } from 'react';
import {
  fetchSalaryRecords,
  updateSalaryApi,
  reviseSalaryApi,
} from '../services/salaryService';
import {
  calculateSalaryBreakdown,
  calculateSalaryStats,
  calculateDepartmentSalaryAnalytics,
} from '../utils/salaryHelpers';
import { useEmployees } from '../hooks/useEmployees';

export const SalaryContext = createContext(null);

/**
 * Single Source of Truth for Salary Summary & PF Management Domain State.
 */
export function SalaryProvider({ children }) {
  const { showToast, addActivity } = useEmployees();
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [selectedCompareRecord, setSelectedCompareRecord] = useState(null);

  // Filters State
  const [filters, setFiltersState] = useState({
    searchTerm: '',
    department: '',
    status: '',
    sortField: 'totalAnnualCTC',
    sortDirection: 'desc',
  });

  // Initial Load from Service Layer
  useEffect(() => {
    fetchSalaryRecords().then((data) => setSalaryRecords(data));
  }, []);

  const setFilters = (newFilters) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState({
      searchTerm: '',
      department: '',
      status: '',
      sortField: 'totalAnnualCTC',
      sortDirection: 'desc',
    });
  };

  // Computed Summary Stats
  const stats = useMemo(() => calculateSalaryStats(salaryRecords), [salaryRecords]);

  // Department Analytics
  const departmentAnalytics = useMemo(
    () => calculateDepartmentSalaryAnalytics(salaryRecords),
    [salaryRecords]
  );

  // Filtered Roster
  const filteredRecords = useMemo(() => {
    let result = [...salaryRecords];
    const { searchTerm, department, status, sortField, sortDirection } = filters;

    const searchStr = typeof searchTerm === 'string' ? searchTerm : String(searchTerm || '');
    if (searchStr.trim()) {
      const q = searchStr.toLowerCase();
      result = result.filter(
        (rec) =>
          rec.employeeId.toLowerCase().includes(q) ||
          rec.employeeName.toLowerCase().includes(q) ||
          rec.designation.toLowerCase().includes(q)
      );
    }

    if (department) {
      result = result.filter((rec) => rec.department === department);
    }

    if (status) {
      result = result.filter((rec) => rec.status === status);
    }

    result.sort((a, b) => {
      let valA = a.calculatedTotals?.[sortField] || a[sortField] || 0;
      let valB = b.calculatedTotals?.[sortField] || b[sortField] || 0;
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [salaryRecords, filters]);

  /**
   * Revises an employee's salary package, generating a new version (v+1).
   */
  const reviseSalary = async (employeeId, revisionInput, reason = 'Annual appraisal revision') => {
    const target = salaryRecords.find(
      (s) => s.employeeId.toLowerCase() === employeeId.toLowerCase()
    );
    if (!target) return;

    const nextVersion = (target.version || 1) + 1;
    const breakdown = calculateSalaryBreakdown(revisionInput);

    const newRevisionEntry = {
      version: nextVersion,
      effectiveDate: revisionInput.effectiveDate || new Date().toISOString().split('T')[0],
      revisedBy: 'Admin User',
      reason,
      earnings: breakdown.earnings,
      calculatedTotals: breakdown.calculatedTotals,
    };

    const auditEntry = {
      action: `Salary Revised (v${nextVersion})`,
      user: 'Admin User',
      timestamp: `${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
      reason,
    };

    const updatedRecord = {
      ...target,
      ...breakdown,
      version: nextVersion,
      effectiveDate: revisionInput.effectiveDate || new Date().toISOString().split('T')[0],
      revisions: [newRevisionEntry, ...(target.revisions || [])],
      auditTrail: [auditEntry, ...(target.auditTrail || [])],
    };

    const result = await reviseSalaryApi(employeeId, updatedRecord);

    setSalaryRecords((prev) =>
      prev.map((s) => (s.employeeId.toLowerCase() === employeeId.toLowerCase() ? result : s))
    );

    addActivity?.({
      title: 'Salary Package Revised',
      description: `Salary revised to v${nextVersion} for ${target.employeeName} (${target.employeeId}).`,
      actor: 'Admin User',
      type: 'payroll',
    });

    showToast(`Salary revised successfully for ${target.employeeName}!`, 4000);
    return result;
  };

  /**
   * Resolves salary record by Employee ID.
   */
  const getSalaryByEmployeeId = (empId) => {
    if (!empId) return null;
    return salaryRecords.find((s) => s.employeeId.toLowerCase() === empId.toLowerCase()) || null;
  };

  return (
    <SalaryContext.Provider
      value={{
        salaryRecords,
        filteredRecords,
        stats,
        departmentAnalytics,
        filters,
        selectedCompareRecord,
        setFilters,
        resetFilters,
        reviseSalary,
        getSalaryByEmployeeId,
        setSelectedCompareRecord,
      }}
    >
      {children}
    </SalaryContext.Provider>
  );
}
