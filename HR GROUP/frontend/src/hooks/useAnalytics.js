import { useContext } from 'react';
import { AnalyticsContext } from '../context/AnalyticsContext';

/**
 * Custom Hook for consuming Executive Analytics Domain Context safely in UI components.
 */
export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
