/**
 * utils/documentHelpers.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Business logic helpers for document expiry calculation, client file validation,
 * size formatting, and summary statistics.
 */

/**
 * Calculates document expiry status and remaining days.
 * @param {string|null} expiryDateStr - YYYY-MM-DD format
 * @returns {{ status: 'Valid'|'Expiring Soon'|'Expired'|'N/A', daysRemaining: number|null }}
 */
export function calculateExpiry(expiryDateStr) {
  if (!expiryDateStr) {
    return { status: 'N/A', daysRemaining: null };
  }

  const expiry = new Date(expiryDateStr);
  if (isNaN(expiry.getTime())) {
    return { status: 'N/A', daysRemaining: null };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry - today;
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return { status: 'Expired', daysRemaining };
  }
  if (daysRemaining <= 30) {
    return { status: 'Expiring Soon', daysRemaining };
  }
  return { status: 'Valid', daysRemaining };
}

/**
 * Checks if document is expired.
 */
export function isExpired(expiryDateStr) {
  const result = calculateExpiry(expiryDateStr);
  return result.status === 'Expired';
}

/**
 * Generates next document ID: DOC-YYYY-XXXX.
 */
export function generateDocumentId(documents = []) {
  const currentYear = new Date().getFullYear();
  let maxSeq = 6;

  if (Array.isArray(documents)) {
    documents.forEach((doc) => {
      if (doc?.id) {
        const parts = doc.id.split('-');
        if (parts.length === 3) {
          const num = parseInt(parts[2], 10);
          if (!isNaN(num) && num > maxSeq) {
            maxSeq = num;
          }
        }
      }
    });
  }

  const nextSeq = String(maxSeq + 1).padStart(4, '0');
  return `DOC-${currentYear}-${nextSeq}`;
}

/**
 * Validates file type (PDF, PNG, JPEG, JPG, DOC, DOCX) and size (<= 5MB).
 * @param {File} file
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateDocumentFile(file) {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File size exceeds 5MB limit (${formatFileSize(file.size)}).` };
  }

  const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'];
  const ext = file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return { valid: false, error: `Unsupported format .${ext}. Allowed: PDF, PNG, JPG, JPEG, DOC, DOCX.` };
  }

  return { valid: true, error: null };
}

/**
 * Formats byte counts into human readable KB or MB string.
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes = 0) {
  if (!bytes || isNaN(bytes)) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Computes global statistics across document repository.
 * @param {Array} documents
 * @returns {Object} Statistics summary
 */
export function calculateDocumentStats(documents = []) {
  if (!Array.isArray(documents)) {
    return { total: 0, verified: 0, pending: 0, rejected: 0, expired: 0, expiringSoon: 0, totalSizeBytes: 0 };
  }

  let verified = 0;
  let pending = 0;
  let rejected = 0;
  let expired = 0;
  let expiringSoon = 0;
  let totalSizeBytes = 0;

  documents.forEach((doc) => {
    totalSizeBytes += doc.sizeBytes || 0;
    if (doc.status === 'Verified') verified++;
    if (doc.status === 'Pending') pending++;
    if (doc.status === 'Rejected') rejected++;
    if (doc.status === 'Expired') expired++;

    const expiryInfo = calculateExpiry(doc.expiryDate);
    if (expiryInfo.status === 'Expiring Soon') expiringSoon++;
    if (expiryInfo.status === 'Expired' && doc.status !== 'Expired') expired++;
  });

  return {
    total: documents.length,
    verified,
    pending,
    rejected,
    expired,
    expiringSoon,
    totalSizeBytes,
    storageUsageFormatted: formatFileSize(totalSizeBytes),
  };
}
