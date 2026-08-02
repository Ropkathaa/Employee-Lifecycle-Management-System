import { useContext } from 'react';
import { DocumentContext } from '../context/DocumentContext';

/**
 * Custom Hook for consuming Employee Document Domain Context.
 * Safely exposes document state and methods to UI components.
 */
export function useDocuments() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}
