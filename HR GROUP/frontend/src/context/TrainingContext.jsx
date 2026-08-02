import React, { createContext, useState, useEffect, useMemo } from 'react';
import {
  fetchTrainingPrograms,
  fetchTrainingAssignments,
  fetchCertificates,
  createTrainingApi,
  assignTrainingApi,
  updateProgressApi,
  issueCertificateApi,
} from '../services/trainingService';
import {
  calculateTrainingStats,
  calculateCompliance,
  generateTrainingId,
  generateCertificateNumber,
} from '../utils/trainingHelpers';
import { useEmployees } from '../hooks/useEmployees';

export const TrainingContext = createContext(null);

/**
 * Single Source of Truth for Mandatory Training & Monitoring Domain State.
 */
export function TrainingProvider({ children }) {
  const { showToast, addActivity, employees } = useEmployees();

  const [programs, setPrograms] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // Filters State
  const [filters, setFiltersState] = useState({
    searchTerm: '',
    category: '',
    department: '',
    mandatory: '',
    priority: '',
    sortField: 'id',
    sortDirection: 'desc',
  });

  // Initial Load from Service Layer
  useEffect(() => {
    Promise.all([
      fetchTrainingPrograms(),
      fetchTrainingAssignments(),
      fetchCertificates(),
    ]).then(([pData, aData, cData]) => {
      setPrograms(pData);
      setAssignments(aData);
      setCertificates(cData);
    });
  }, []);

  const setFilters = (newFilters) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState({
      searchTerm: '',
      category: '',
      department: '',
      mandatory: '',
      priority: '',
      sortField: 'id',
      sortDirection: 'desc',
    });
  };

  // Computed Summary Stats & Compliance
  const stats = useMemo(
    () => calculateTrainingStats(programs, assignments, certificates),
    [programs, assignments, certificates]
  );

  const compliance = useMemo(
    () => calculateCompliance(programs, assignments),
    [programs, assignments]
  );

  // Filtered Programs Roster
  const filteredPrograms = useMemo(() => {
    let result = [...programs];
    const { searchTerm, category, department, mandatory, priority, sortField, sortDirection } = filters;

    const searchStr = typeof searchTerm === 'string' ? searchTerm : String(searchTerm || '');
    if (searchStr.trim()) {
      const q = searchStr.toLowerCase();
      result = result.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.instructor.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q)
      );
    }

    if (category) {
      result = result.filter((p) => p.category === category);
    }

    if (department) {
      result = result.filter((p) => p.department === department || p.department === 'All Departments');
    }

    if (mandatory) {
      const isMand = mandatory === 'Mandatory';
      result = result.filter((p) => p.isMandatory === isMand);
    }

    if (priority) {
      result = result.filter((p) => p.priority === priority);
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
  }, [programs, filters]);

  /**
   * Creates a new training program.
   */
  const createTraining = async (programInput) => {
    const newId = generateTrainingId(programs);
    const newProgram = {
      id: newId,
      status: 'Published',
      priority: programInput.priority || 'Medium',
      stats: { assignedCount: 0, completedCount: 0, inProgressCount: 0, overdueCount: 0 },
      ...programInput,
    };

    const result = await createTrainingApi(newProgram);
    setPrograms((prev) => [result, ...prev]);

    addActivity?.({
      title: 'Training Program Created',
      description: `Created mandatory training program "${result.name}" (${result.id}).`,
      actor: 'Admin User',
      type: 'training',
    });

    showToast(`Training Program ${result.id} created successfully!`, 4000);
    return result;
  };

  /**
   * Assigns training program to selected target (Employee, Department, Role, or Entire Org).
   */
  const assignTraining = async (trainingId, targetType, targetValue, dueDate) => {
    const prog = programs.find((p) => p.id === trainingId);
    if (!prog) return;

    let targetEmployees = [];
    if (targetType === 'Individual') {
      const emp = employees.find((e) => e.id === targetValue || e.name === targetValue);
      if (emp) targetEmployees = [emp];
    } else if (targetType === 'Department') {
      targetEmployees = employees.filter((e) => e.department === targetValue);
    } else if (targetType === 'Role') {
      targetEmployees = employees.filter((e) => e.role === targetValue || e.designation === targetValue);
    } else if (targetType === 'Organization') {
      targetEmployees = [...employees];
    }

    if (targetEmployees.length === 0) {
      targetEmployees = [
        { id: 'EMP-2026-0014', name: 'Arjun Mehta', department: 'Engineering', designation: 'Senior Frontend Developer' },
        { id: 'EMP-2026-0013', name: 'Priya Sharma', department: 'Human Resources', designation: 'HR Business Partner' },
      ];
    }

    const newAssignments = targetEmployees.map((emp, index) => ({
      id: `TRN-ASSIGN-${Date.now()}-${index}`,
      trainingId,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department || 'General',
      designation: emp.designation || emp.role || 'Staff',
      status: 'Assigned',
      progress: 0,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || prog.completionDeadline || '2026-08-31',
      certificateId: null,
    }));

    setAssignments((prev) => [...newAssignments, ...prev]);

    // Update program stats count
    setPrograms((prev) =>
      prev.map((p) =>
        p.id === trainingId
          ? {
              ...p,
              stats: {
                ...p.stats,
                assignedCount: (p.stats?.assignedCount || 0) + newAssignments.length,
                inProgressCount: (p.stats?.inProgressCount || 0) + newAssignments.length,
              },
            }
          : p
      )
    );

    addActivity?.({
      title: 'Training Assigned',
      description: `Assigned "${prog.name}" to ${newAssignments.length} employee(s).`,
      actor: 'Admin User',
      type: 'training',
    });

    showToast(`Successfully assigned training to ${newAssignments.length} employee(s)!`, 4000);
  };

  /**
   * Updates employee progress for an assigned training.
   */
  const updateProgress = async (assignmentId, newProgress) => {
    const target = assignments.find((a) => a.id === assignmentId);
    if (!target) return;

    const isComplete = newProgress >= 100;
    const updatedStatus = isComplete ? 'Completed' : 'In Progress';

    let cert = null;
    if (isComplete && !target.certificateId) {
      const prog = programs.find((p) => p.id === target.trainingId);
      const certId = `CERT-2026-${Date.now().toString().slice(-4)}`;
      cert = {
        id: certId,
        certificateNumber: generateCertificateNumber(prog?.category || 'GEN'),
        trainingId: target.trainingId,
        trainingName: prog?.name || 'Mandatory Training Module',
        employeeId: target.employeeId,
        employeeName: target.employeeName,
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Certificate Issued',
      };
      setCertificates((prev) => [cert, ...prev]);
    }

    const updatedAssignment = {
      ...target,
      progress: newProgress,
      status: updatedStatus,
      completionDate: isComplete ? new Date().toISOString().split('T')[0] : target.completionDate,
      certificateId: cert ? cert.id : target.certificateId,
    };

    setAssignments((prev) => prev.map((a) => (a.id === assignmentId ? updatedAssignment : a)));

    if (isComplete) {
      showToast(`Training completed & certificate issued for ${target.employeeName}!`, 4000);
    }
  };

  const getProgramById = (id) => programs.find((p) => p.id.toLowerCase() === id.toLowerCase()) || null;

  return (
    <TrainingContext.Provider
      value={{
        programs,
        filteredPrograms,
        assignments,
        certificates,
        stats,
        compliance,
        filters,
        setFilters,
        resetFilters,
        createTraining,
        assignTraining,
        updateProgress,
        getProgramById,
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
}
