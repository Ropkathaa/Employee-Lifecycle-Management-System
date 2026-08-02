import React, { createContext, useState, useEffect, useMemo } from 'react';
import {
  fetchEmployees,
  fetchDashboardStats,
  fetchRecentActivities,
  createEmployeeApi,
  updateEmployeeApi,
  deleteEmployeeApi,
} from '../services/employeeService';
import {
  generateEmployeeId as generateNextIdHelper,
  calculateEmployeeStats,
  buildActivityObject,
  generateAvatarInitials,
} from '../utils/employeeHelpers';

export const EmployeeContext = createContext(null);

/**
 * Centralized Single Source of Truth for Employee Domain State.
 * Maintains real-time state synchronization across Roster, Search, Dashboard, and Stats.
 */
export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Roster Filter State
  const [filters, setFiltersState] = useState({
    searchTerm: '',
    department: '',
    status: '',
    employmentType: '',
    sortField: 'id',
    sortDirection: 'asc',
  });

  // Toast Notification State
  const [toast, setToast] = useState({ message: '', visible: false, type: 'success' });

  // Initial Load from Service Layer
  useEffect(() => {
    fetchEmployees().then((data) => setEmployees(data));
    fetchDashboardStats().then((data) => setStatsData(data));
    fetchRecentActivities().then((data) => setRecentActivities(data));
  }, []);

  const showToast = (message, duration = 4000) => {
    setToast({ message, visible: true, type: 'success' });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, duration);
  };

  /**
   * Helper to set specific filter properties
   */
  const setFilters = (newFilters) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState({
      searchTerm: '',
      department: '',
      status: '',
      employmentType: '',
      sortField: 'id',
      sortDirection: 'asc',
    });
  };

  /**
   * Filtered and sorted employee list based on current filters state
   */
  const filteredEmployees = useMemo(() => {
    let result = [...employees];
    const { searchTerm, department, status, employmentType, sortField, sortDirection } = filters;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (emp) =>
          emp.name.toLowerCase().includes(q) ||
          emp.id.toLowerCase().includes(q) ||
          emp.email.toLowerCase().includes(q)
      );
    }

    if (department) {
      result = result.filter((emp) => emp.department === department);
    }

    if (status) {
      result = result.filter((emp) => emp.status === status);
    }

    if (employmentType) {
      result = result.filter((emp) => emp.employmentType === employmentType);
    }

    result.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [employees, filters]);

  /**
   * Creates a new employee record and synchronizes:
   * - Roster state
   * - Total Employee & New Joinee stat counts
   * - Recent Activity log
   * - Displays 4s Toast Notification
   */
  const createEmployee = async (newEmpData) => {
    const formattedEmp = {
      ...newEmpData,
      id: newEmpData.id || generateNextIdHelper(employees),
      name: newEmpData.name || `${newEmpData.firstName} ${newEmpData.lastName}`,
      avatarInitials: generateAvatarInitials(newEmpData.name || `${newEmpData.firstName} ${newEmpData.lastName}`),
      avatarColor: newEmpData.avatarColor || 'bg-violet-500',
      status: newEmpData.status || 'Active',
    };

    const created = await createEmployeeApi(formattedEmp);

    setEmployees((prev) => [created, ...prev]);

    // Synchronize Stats Cards
    setStatsData((prevStats) =>
      prevStats.map((stat) => {
        if (stat.id === 'stat-1' || stat.id === 'stat-2') {
          const num = parseInt(stat.value, 10) || 0;
          return { ...stat, value: String(num + 1) };
        }
        return stat;
      })
    );

    // Synchronize Activity Log
    const newActivity = buildActivityObject(
      'New Employee Profile Created',
      `Employee ${created.name} was created by HR`,
      'onboarding',
      'HR Admin'
    );
    setRecentActivities((prev) => [newActivity, ...prev]);

    showToast('Employee created successfully.', 4000);
    return created;
  };

  /**
   * Updates an existing employee profile.
   */
  const updateEmployee = async (id, updatedData) => {
    const updated = await updateEmployeeApi(id, updatedData);
    setEmployees((prev) =>
      prev.map((emp) => (emp.id.toLowerCase() === id.toLowerCase() ? { ...emp, ...updated } : emp))
    );
    showToast('Employee profile updated successfully.', 4000);
    return updated;
  };

  /**
   * Deletes an employee record.
   */
  const deleteEmployee = async (id) => {
    await deleteEmployeeApi(id);
    setEmployees((prev) => prev.filter((emp) => emp.id.toLowerCase() !== id.toLowerCase()));
    showToast('Employee profile deleted.', 4000);
  };

  /**
   * Resolves employee by ID.
   */
  const getEmployee = (id) => {
    if (!id) return null;
    return employees.find((emp) => emp.id.toLowerCase() === id.toLowerCase()) || null;
  };

  /**
   * Searches employee records by query string.
   */
  const searchEmployees = (query = '') => {
    if (!query.trim()) return employees;
    const q = query.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.id.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q)
    );
  };

  const generateEmployeeId = () => generateNextIdHelper(employees);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        filteredEmployees,
        statsData,
        recentActivities,
        filters,
        toast,
        setFilters,
        resetFilters,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployee,
        searchEmployees,
        generateEmployeeId,
        showToast,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}
