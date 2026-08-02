import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { useDocuments } from '../hooks/useDocuments';
import { useOffers } from '../hooks/useOffers';
import { useSalary } from '../hooks/useSalary';
import { useTraining } from '../hooks/useTraining';
import { fetchSystemHealth, fetchExecutiveInsights } from '../services/analyticsService';
import { fetchReportTemplates, generateReportApi, exportReportApi } from '../services/reportService';
import { selectExecutiveKPIs, selectDepartmentAnalytics } from '../utils/analyticsSelectors';

export const AnalyticsContext = createContext(null);

/**
 * Single Source of Truth for Executive HR Analytics & Report Generation Domain State.
 * Aggregates live data from all module contexts automatically.
 */
export function AnalyticsProvider({ children }) {
  const { employees, showToast, addActivity } = useEmployees();
  const { documents } = useDocuments();
  const { offers } = useOffers();
  const { salaryRecords } = useSalary();
  const { programs, assignments } = useTraining();

  const [systemHealth, setSystemHealth] = useState(null);
  const [executiveInsights, setExecutiveInsights] = useState([]);
  const [reportTemplates, setReportTemplates] = useState([]);
  const [savedReports, setSavedReports] = useState([]);

  // Filters State
  const [filters, setFiltersState] = useState({
    searchTerm: '',
    category: 'All Reports',
    department: '',
    dateRange: 'This Quarter',
  });

  // Initial Load from Service Layer
  useEffect(() => {
    Promise.all([
      fetchSystemHealth(),
      fetchExecutiveInsights(),
      fetchReportTemplates(),
    ]).then(([healthData, insightsData, templatesData]) => {
      setSystemHealth(healthData);
      setExecutiveInsights(insightsData);
      setReportTemplates(templatesData);
    });
  }, []);

  const setFilters = (newFilters) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState({
      searchTerm: '',
      category: 'All Reports',
      department: '',
      dateRange: 'This Quarter',
    });
  };

  // Live Aggregated Executive KPIs
  const kpis = useMemo(
    () => selectExecutiveKPIs({ employees, documents, offers, salaryRecords, programs, assignments }),
    [employees, documents, offers, salaryRecords, programs, assignments]
  );

  // Live Department Analytics
  const departmentAnalytics = useMemo(
    () => selectDepartmentAnalytics({ employees, salaryRecords, assignments }),
    [employees, salaryRecords, assignments]
  );

  // Filtered Report Templates Library
  const filteredTemplates = useMemo(() => {
    let result = [...reportTemplates];
    const { searchTerm, category } = filters;

    const searchStr = typeof searchTerm === 'string' ? searchTerm : String(searchTerm || '');
    if (searchStr.trim()) {
      const q = searchStr.toLowerCase();
      result = result.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All Reports') {
      result = result.filter((r) => r.category === category);
    }

    return result;
  }, [reportTemplates, filters]);

  /**
   * Generates a custom HR report based on criteria.
   */
  const generateReport = async (criteria) => {
    const report = await generateReportApi(criteria);
    setSavedReports((prev) => [report, ...prev]);

    addActivity?.({
      title: 'HR Report Generated',
      description: `Generated report "${report.title}" (${report.id}).`,
      actor: 'Admin User',
      type: 'analytics',
    });

    showToast(`Report ${report.id} generated successfully!`, 4000);
    return report;
  };

  /**
   * Export architecture handler placeholder.
   */
  const exportReport = async (reportId, format = 'PDF') => {
    const res = await exportReportApi(reportId, format);
    showToast(`Export queued in ${format} format! (Mock Download Ready)`, 4000);
    return res;
  };

  return (
    <AnalyticsContext.Provider
      value={{
        kpis,
        departmentAnalytics,
        systemHealth,
        executiveInsights,
        reportTemplates,
        filteredTemplates,
        savedReports,
        filters,
        setFilters,
        resetFilters,
        generateReport,
        exportReport,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}
