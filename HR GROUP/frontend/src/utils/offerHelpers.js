/**
 * utils/offerHelpers.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable domain logic utilities for Offer Packet Management:
 * ID generation, compensation math, validity calculation, audit logging,
 * version comparison diff engine, editability rules, and AI hooks.
 */

/**
 * Business Rule: Check if an offer packet is editable.
 * Editable statuses: Draft, Pending Approval, Approved, Sent, Negotiation Requested, Under Negotiation, Revised Offer Sent.
 * Read-Only statuses: Accepted, Rejected, Declined, Expired.
 * @param {string} status
 * @returns {boolean}
 */
export function isOfferEditable(status) {
  const readOnlyStatuses = ['Accepted', 'Rejected', 'Declined', 'Expired'];
  return !readOnlyStatuses.includes(status);
}

/**
 * Generates the next sequential Offer ID in format OFF-YYYY-XXXX.
 * @param {Array} offers
 * @returns {string} Next formatted Offer ID
 */
export function generateOfferId(offers = []) {
  const currentYear = new Date().getFullYear();
  let maxSeq = 4;

  if (Array.isArray(offers)) {
    offers.forEach((off) => {
      if (off?.id) {
        const parts = off.id.split('-');
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
  return `OFF-${currentYear}-${nextSeq}`;
}

/**
 * Computes complete compensation breakdown.
 * @param {Object} comp
 * @returns {Object} Calculated compensation components
 */
export function calculateCompensation(comp = {}) {
  const basic = parseFloat(comp.basicSalary) || 0;
  const hra = parseFloat(comp.hra) || (basic * 0.4);
  const special = parseFloat(comp.specialAllowance) || 0;
  const medical = parseFloat(comp.medicalAllowance) || 0;
  const travel = parseFloat(comp.travelAllowance) || 0;
  const bonus = parseFloat(comp.bonus) || 0;
  const variable = parseFloat(comp.variablePay) || 0;
  const employerPf = parseFloat(comp.employerPf) || (basic * 0.12);
  const employeePf = parseFloat(comp.employeePf) || (basic * 0.12);
  const gratuity = parseFloat(comp.gratuity) || ((basic / 26) * 15 * 5) / 5;
  const insurance = parseFloat(comp.insurance) || 20000;

  const monthlyGross = Math.round(basic / 12 + hra / 12 + special / 12 + medical / 12 + travel / 12);
  const annualBase = basic + hra + special + medical + travel;
  const totalCTC = Math.round(annualBase + bonus + variable + employerPf + gratuity + insurance);

  return {
    basicSalary: basic,
    hra,
    specialAllowance: special,
    medicalAllowance: medical,
    travelAllowance: travel,
    bonus,
    variablePay: variable,
    employerPf,
    employeePf,
    gratuity: Math.round(gratuity),
    insurance,
    monthlyGross,
    annualBase,
    totalCTC,
  };
}

/**
 * Calculates remaining validity days for an offer.
 * @param {string|null} validUntilDate
 * @returns {{ status: 'Valid'|'Expiring Soon'|'Expired'|'N/A', daysRemaining: number|null }}
 */
export function calculateOfferValidity(validUntilDate) {
  if (!validUntilDate) return { status: 'N/A', daysRemaining: null };

  const expiry = new Date(validUntilDate);
  if (isNaN(expiry.getTime())) return { status: 'N/A', daysRemaining: null };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const daysRemaining = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) return { status: 'Expired', daysRemaining };
  if (daysRemaining <= 5) return { status: 'Expiring Soon', daysRemaining };
  return { status: 'Valid', daysRemaining };
}

/**
 * Formats a number to Indian Rupee currency format (e.g., ₹12,00,000).
 */
export function formatCurrency(amount = 0) {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString('en-IN')}`;
}

/**
 * Builds an immutable audit log record.
 */
export function buildOfferAuditRecord(action, user = 'HR Admin', previousState = 'N/A', currentState = 'N/A', reason = '') {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return {
    id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    action,
    user,
    timestamp: `${dateStr} ${timeStr}`,
    previousState,
    currentState,
    reason,
  };
}

/**
 * Compares two offer version objects side-by-side and extracts diffs.
 * @param {Object} vA - Baseline offer object
 * @param {Object} vB - Target/Current offer object
 * @returns {Array<{ field: string, label: string, valA: any, valB: any, isDifferent: boolean }>}
 */
export function compareOfferVersions(vA = {}, vB = {}) {
  const compA = vA.compensation || vA.snapshot?.compensation || {};
  const compB = vB.compensation || vB.snapshot?.compensation || {};

  const fields = [
    { field: 'totalCTC', label: 'Annual Cost to Company (CTC)', valA: formatCurrency(compA.totalCTC), valB: formatCurrency(compB.totalCTC), rawA: compA.totalCTC, rawB: compB.totalCTC },
    { field: 'basicSalary', label: 'Basic Salary (Annual)', valA: formatCurrency(compA.basicSalary), valB: formatCurrency(compB.basicSalary), rawA: compA.basicSalary, rawB: compB.basicSalary },
    { field: 'hra', label: 'House Rent Allowance (HRA)', valA: formatCurrency(compA.hra), valB: formatCurrency(compB.hra), rawA: compA.hra, rawB: compB.hra },
    { field: 'specialAllowance', label: 'Special Allowance', valA: formatCurrency(compA.specialAllowance), valB: formatCurrency(compB.specialAllowance), rawA: compA.specialAllowance, rawB: compB.specialAllowance },
    { field: 'designation', label: 'Designation / Role', valA: vA.designation || vA.snapshot?.designation || 'N/A', valB: vB.designation || vB.snapshot?.designation || 'N/A' },
    { field: 'department', label: 'Department', valA: vA.department || vA.snapshot?.department || 'N/A', valB: vB.department || vB.snapshot?.department || 'N/A' },
    { field: 'joiningDate', label: 'Joining Date', valA: vA.joiningDate || vA.snapshot?.joiningDate || 'N/A', valB: vB.joiningDate || vB.snapshot?.joiningDate || 'N/A' },
    { field: 'workLocation', label: 'Work Location', valA: vA.workLocation || vA.snapshot?.workLocation || 'N/A', valB: vB.workLocation || vB.snapshot?.workLocation || 'N/A' },
    { field: 'benefits', label: 'Included Perks & Benefits', valA: (vA.benefits || vA.snapshot?.benefits || []).join(', '), valB: (vB.benefits || vB.snapshot?.benefits || []).join(', ') },
    { field: 'validUntilDate', label: 'Offer Validity Date', valA: vA.validUntilDate || vA.snapshot?.validUntilDate || 'N/A', valB: vB.validUntilDate || vB.snapshot?.validUntilDate || 'N/A' },
  ];

  return fields.map((item) => {
    const isDiff = item.rawA !== undefined ? item.rawA !== item.rawB : item.valA !== item.valB;
    return { ...item, isDifferent: isDiff };
  });
}

/**
 * Computes summary count statistics across offer repository.
 */
export function calculateOfferStats(offers = []) {
  if (!Array.isArray(offers)) {
    return { total: 0, pending: 0, approved: 0, rejected: 0, sent: 0, accepted: 0, declined: 0, expired: 0 };
  }

  let pending = 0, approved = 0, rejected = 0, sent = 0, accepted = 0, declined = 0, expired = 0;

  offers.forEach((off) => {
    if (off.status === 'Pending Approval') pending++;
    if (off.status === 'Approved') approved++;
    if (off.status === 'Rejected') rejected++;
    if (off.status === 'Sent' || off.status === 'Revised Offer Sent') sent++;
    if (off.status === 'Accepted') accepted++;
    if (off.status === 'Declined') declined++;

    const validity = calculateOfferValidity(off.validUntilDate);
    if (validity.status === 'Expired' || off.status === 'Expired') expired++;
  });

  return { total: offers.length, pending, approved, rejected, sent, accepted, declined, expired };
}

/* ─────────────────────────────────────────────────────────────────────────────
 * AI READINESS EXTENSION HOOKS
 * ───────────────────────────────────────────────────────────────────────────── */

export function validateOfferAI(offerData) {
  return { isCompliant: true, warnings: [], suggestions: [] };
}

export function salaryRecommendationAI(designation, experienceYears) {
  return { recommendedMin: 600000, recommendedMax: 1200000, confidenceScore: 0.92 };
}

export function marketSalaryComparisonAI(designation, CTC) {
  return { percentile: 75, marketAverage: CTC * 0.95 };
}

export function clauseRecommendationAI(department) {
  return ['Standard IP Assignment Clause', 'Non-Compete Agreement (12 months)'];
}
