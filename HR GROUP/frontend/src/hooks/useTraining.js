import { useContext } from 'react';
import { TrainingContext } from '../context/TrainingContext';

/**
 * Custom Hook for consuming Training Domain Context safely in UI components.
 */
export function useTraining() {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
}
