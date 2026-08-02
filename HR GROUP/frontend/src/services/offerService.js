/**
 * services/offerService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Enterprise Service Layer for Offer Packet Management.
 * Returns async Promises simulating network requests.
 * In Phase 2+, replace implementation with Express, MongoDB, PDFKit, Nodemailer endpoints.
 */

import { mockOffers as seedOffers, OFFER_TEMPLATES as seedTemplates } from '../mock/offers';

/**
 * Fetches master list of offer packets.
 * @returns {Promise<Array>}
 */
export async function fetchOffers() {
  return Promise.resolve([...seedOffers]);
}

/**
 * Fetches single offer packet by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function fetchOfferById(id) {
  const offer = seedOffers.find((o) => o.id.toLowerCase() === id.toLowerCase());
  return Promise.resolve(offer ? { ...offer } : null);
}

/**
 * Fetches offer preset templates.
 * @returns {Promise<Array>}
 */
export async function fetchOfferTemplates() {
  return Promise.resolve([...seedTemplates]);
}

/**
 * Generates a new offer packet record.
 * @param {Object} offerData
 * @returns {Promise<Object>}
 */
export async function generateOfferApi(offerData) {
  return Promise.resolve({ ...offerData });
}

/**
 * Updates an existing offer packet.
 * @param {string} id
 * @param {Object} updatedData
 * @returns {Promise<Object>}
 */
export async function updateOfferApi(id, updatedData) {
  return Promise.resolve({ id, ...updatedData });
}

/**
 * Approves an offer packet.
 * @param {string} id
 * @param {string} approver
 * @param {string} notes
 * @returns {Promise<Object>}
 */
export async function approveOfferApi(id, approver = 'HR Director', notes = '') {
  return Promise.resolve({
    id,
    status: 'Approved',
    approvedBy: approver,
    approvedAt: new Date().toISOString().split('T')[0],
    notes,
  });
}

/**
 * Rejects an offer packet.
 * @param {string} id
 * @param {string} rejector
 * @param {string} reason
 * @returns {Promise<Object>}
 */
export async function rejectOfferApi(id, rejector = 'HR Admin', reason = '') {
  return Promise.resolve({
    id,
    status: 'Rejected',
    rejectedBy: rejector,
    rejectedAt: new Date().toISOString().split('T')[0],
    reason,
  });
}

/**
 * Marks offer as Accepted by candidate.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function acceptOfferApi(id) {
  return Promise.resolve({
    id,
    status: 'Accepted',
    acceptedAt: new Date().toISOString().split('T')[0],
  });
}

/**
 * Marks offer as Declined by candidate.
 * @param {string} id
 * @param {string} reason
 * @returns {Promise<Object>}
 */
export async function declineOfferApi(id, reason = '') {
  return Promise.resolve({
    id,
    status: 'Declined',
    declinedAt: new Date().toISOString().split('T')[0],
    reason,
  });
}

/**
 * Deletes an offer packet.
 * @param {string} id
 * @returns {Promise<{ success: boolean, id: string }>}
 */
export async function deleteOfferApi(id) {
  return Promise.resolve({ success: true, id });
}
