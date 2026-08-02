import { useContext } from 'react';
import { SalaryContext } from '../context/SalaryContext';

/**
 * Custom Hook for consuming Salary Domain Context safely in UI components.
 */
export function useSalary() {
  const context = useContext(SalaryContext);
  if (!context) {
    throw new Error('useSalary must be used within a SalaryProvider');
  }
  return context;
}
