import { useContext } from 'react';
import { EmployeeContext } from '../context/EmployeeContext';

/**
 * Reusable Custom Hook for consuming Employee Domain State & Operations.
 * Prevents UI components from directly accessing or coupling with Context.
 */
export function useEmployees() {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
}
