import React, { createContext, useContext, useState, useCallback } from 'react';
import { employeeService } from '../services/employeeService';

const EmployeeContext = createContext();

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
};

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dashboard state
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // ======================
  // Dashboard
  // ======================

  const fetchDashboard = useCallback(async () => {
    setDashboardLoading(true);
    try {
      const response = await employeeService.getDashboard();
      const data = response.data?.data || null;
      setDashboardData(data);
      // Also set the profile from dashboard data if available
      if (data?.profile) {
        setProfile(data.profile);
      }
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      throw err;
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  // ======================
  // Profile Methods
  // ======================

  const fetchProfile = useCallback(async () => {
    setProfileLoading(true);
    try {
      const response = await employeeService.getProfile();
      setProfile(response.data?.data || null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
      throw err;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const updateProfileData = useCallback(async (profileData) => {
    setProfileLoading(true);
    try {
      const response = await employeeService.updateProfile(profileData);
      setProfile(response.data?.data || null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const uploadProfileAvatar = useCallback(async (formData) => {
    setProfileLoading(true);
    try {
      const response = await employeeService.uploadProfileAvatar(formData);
      setProfile(response.data?.data || null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload profile picture');
      throw err;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const fetchEmployees = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeService.getAll(params);
      setEmployees(response.data?.data || []);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch employees');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployeeById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeService.getById(id);
      setSelectedEmployee(response.data?.data || null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch employee');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEmployee = useCallback(async (employeeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeService.create(employeeData);
      setEmployees((prev) => [...prev, response.data?.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create employee');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEmployee = useCallback(async (id, employeeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeService.update(id, employeeData);
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === id ? response.data?.data : emp))
      );
      setSelectedEmployee(response.data?.data || null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update employee');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEmployee = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await employeeService.delete(id);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      if (selectedEmployee?._id === id) setSelectedEmployee(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete employee');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedEmployee]);

const value = {
    employees,
    selectedEmployee,
    profile,
    profileLoading,
    loading,
    error,
    dashboardData,
    dashboardLoading,
    fetchDashboard,
    fetchProfile,
    updateProfileData,
    uploadProfileAvatar,
    fetchEmployees,
    fetchEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    setSelectedEmployee,
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};

