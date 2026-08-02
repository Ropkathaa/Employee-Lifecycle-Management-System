/**
 * services/documentService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Enterprise Service Layer for Employee Document Management.
 * Returns async Promises simulating network requests.
 * In Phase 2+, replace implementation with Multer/MongoDB endpoints.
 */

import { mockDocuments as seedDocuments } from '../mock/documents';

/**
 * Fetches master document list.
 * @returns {Promise<Array>}
 */
export async function fetchDocuments() {
  return Promise.resolve([...seedDocuments]);
}

/**
 * Fetches single document by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function fetchDocumentById(id) {
  const doc = seedDocuments.find((d) => d.id.toLowerCase() === id.toLowerCase());
  return Promise.resolve(doc ? { ...doc } : null);
}

/**
 * Uploads a new document record.
 * @param {Object} newDocData
 * @returns {Promise<Object>}
 */
export async function uploadDocumentApi(newDocData) {
  return Promise.resolve({ ...newDocData });
}

/**
 * Updates document verification status & notes.
 * @param {string} id
 * @param {string} status - 'Verified' | 'Rejected' | 'Needs Update' | 'Expired'
 * @param {string} notes
 * @param {string} verifiedBy
 * @returns {Promise<Object>}
 */
export async function verifyDocumentApi(id, status, notes = '', verifiedBy = 'Admin User') {
  return Promise.resolve({
    id,
    status,
    notes,
    verifiedBy,
    verifiedAt: new Date().toISOString().split('T')[0],
  });
}

/**
 * Deletes a document record.
 * @param {string} id
 * @returns {Promise<{ success: boolean, id: string }>}
 */
export async function deleteDocumentApi(id) {
  return Promise.resolve({ success: true, id });
}
