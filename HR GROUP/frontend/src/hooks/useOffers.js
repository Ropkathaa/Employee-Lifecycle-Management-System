import { useContext } from 'react';
import { OfferContext } from '../context/OfferContext';

/**
 * Custom Hook for consuming Offer Domain Context safely in UI components.
 */
export function useOffers() {
  const context = useContext(OfferContext);
  if (!context) {
    throw new Error('useOffers must be used within an OfferProvider');
  }
  return context;
}
