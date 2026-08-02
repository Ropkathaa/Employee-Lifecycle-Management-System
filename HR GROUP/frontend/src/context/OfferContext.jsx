import React, { createContext, useState, useEffect, useMemo } from 'react';
import {
  fetchOffers,
  fetchOfferTemplates,
  generateOfferApi,
  updateOfferApi,
  approveOfferApi,
  rejectOfferApi,
  acceptOfferApi,
  declineOfferApi,
} from '../services/offerService';
import {
  generateOfferId,
  calculateCompensation,
  calculateOfferStats,
  buildOfferAuditRecord,
  isOfferEditable,
} from '../utils/offerHelpers';
import { useEmployees } from '../hooks/useEmployees';

export const OfferContext = createContext(null);

/**
 * Single Source of Truth for Offer Packet Management Domain State.
 */
export function OfferProvider({ children }) {
  const { showToast, addActivity } = useEmployees();
  const [offers, setOffers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [previewModalOffer, setPreviewModalOffer] = useState(null);

  // Filters State
  const [filters, setFiltersState] = useState({
    searchTerm: '',
    department: '',
    status: '',
    templateType: '',
    sortField: 'generatedDate',
    sortDirection: 'desc',
  });

  // Initial Load from Service Layer
  useEffect(() => {
    fetchOffers().then((data) => setOffers(data));
    fetchOfferTemplates().then((tpls) => setTemplates(tpls));
  }, []);

  const setFilters = (newFilters) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState({
      searchTerm: '',
      department: '',
      status: '',
      templateType: '',
      sortField: 'generatedDate',
      sortDirection: 'desc',
    });
  };

  // Computed Summary Stats
  const stats = useMemo(() => calculateOfferStats(offers), [offers]);

  // Filtered Offers Roster
  const filteredOffers = useMemo(() => {
    let result = [...offers];
    const { searchTerm, department, status, templateType, sortField, sortDirection } = filters;

    const searchStr = typeof searchTerm === 'string' ? searchTerm : String(searchTerm || '');
    if (searchStr.trim()) {
      const q = searchStr.toLowerCase();
      result = result.filter(
        (off) =>
          off.id.toLowerCase().includes(q) ||
          off.candidateName.toLowerCase().includes(q) ||
          off.candidateEmail.toLowerCase().includes(q) ||
          off.designation.toLowerCase().includes(q)
      );
    }

    if (department) {
      result = result.filter((off) => off.department === department);
    }

    if (status) {
      result = result.filter((off) => off.status === status);
    }

    if (templateType) {
      result = result.filter((off) => off.employmentType === templateType);
    }

    result.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [offers, filters]);

  /**
   * Generates a new offer packet record.
   */
  const generateOffer = async (offerInputData) => {
    const calculatedComp = calculateCompensation(offerInputData.compensation || {});
    const initialAudit = buildOfferAuditRecord('Offer Generated', 'HR Admin', 'None', 'Pending Approval', 'Initial creation');

    const formattedOffer = {
      ...offerInputData,
      id: offerInputData.id || generateOfferId(offers),
      status: offerInputData.status || 'Pending Approval',
      version: 1,
      generatedDate: new Date().toISOString().split('T')[0],
      generatedBy: offerInputData.generatedBy || 'HR Admin',
      compensation: calculatedComp,
      versions: [
        {
          version: 1,
          date: new Date().toISOString().split('T')[0],
          author: 'HR Admin',
          summary: 'Initial offer packet created',
          snapshot: { ...offerInputData, compensation: calculatedComp, version: 1 },
        },
      ],
      negotiations: [],
      auditTrail: [initialAudit],
    };

    const created = await generateOfferApi(formattedOffer);
    setOffers((prev) => [created, ...prev]);
    showToast(`Offer ${created.id} generated successfully.`, 4000);
    return created;
  };

  /**
   * Revises an existing offer packet, creating a new version (v+1).
   */
  const reviseOffer = async (id, updatedData, changeSummary = 'Updated offer parameters') => {
    const target = offers.find((o) => o.id.toLowerCase() === id.toLowerCase());
    if (!target) return;

    if (!isOfferEditable(target.status)) {
      showToast(`Cannot edit offer ${id} because it is ${target.status}.`, 4000);
      return;
    }

    const nextVersionNum = (target.version || 1) + 1;
    const calculatedComp = calculateCompensation(updatedData.compensation || target.compensation);

    const versionSnapshot = {
      version: nextVersionNum,
      date: new Date().toISOString().split('T')[0],
      author: 'HR Admin',
      summary: changeSummary,
      snapshot: { ...target, ...updatedData, compensation: calculatedComp, version: nextVersionNum },
    };

    const auditRec = buildOfferAuditRecord(
      `Offer Revised (v${nextVersionNum})`,
      'HR Admin',
      target.status,
      'Revised Offer Sent',
      changeSummary
    );

    const revisedOffer = {
      ...target,
      ...updatedData,
      compensation: calculatedComp,
      version: nextVersionNum,
      status: 'Revised Offer Sent',
      versions: [versionSnapshot, ...(target.versions || [])],
      auditTrail: [auditRec, ...(target.auditTrail || [])],
    };

    const result = await updateOfferApi(id, revisedOffer);
    setOffers((prev) => prev.map((o) => (o.id.toLowerCase() === id.toLowerCase() ? result : o)));
    showToast(`Offer ${id} revised to Version ${nextVersionNum}!`, 4000);
    return result;
  };

  /**
   * Records a candidate negotiation request.
   */
  const recordNegotiation = async (id, negotiationData) => {
    const target = offers.find((o) => o.id.toLowerCase() === id.toLowerCase());
    if (!target) return;

    const roundNum = (target.negotiations?.length || 0) + 1;
    const now = new Date();

    const newNegotiationEntry = {
      round: roundNum,
      requestType: negotiationData.requestType || 'Custom Request',
      requestedBy: negotiationData.requestedBy || `${target.candidateName} (Candidate)`,
      requestDate: now.toISOString().split('T')[0],
      comments: negotiationData.comments || '',
      hrResponse: negotiationData.hrResponse || 'Under HR Review',
      status: negotiationData.status || 'Under Negotiation',
      timestamp: `${now.toLocaleDateString('en-IN')} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
    };

    const auditRec = buildOfferAuditRecord(
      'Negotiation Recorded',
      'HR Admin',
      target.status,
      'Under Negotiation',
      `Round ${roundNum}: ${negotiationData.requestType}`
    );

    const updated = {
      ...target,
      status: 'Under Negotiation',
      negotiations: [newNegotiationEntry, ...(target.negotiations || [])],
      auditTrail: [auditRec, ...(target.auditTrail || [])],
    };

    setOffers((prev) => prev.map((o) => (o.id.toLowerCase() === id.toLowerCase() ? updated : o)));
    showToast(`Negotiation request recorded for offer ${id}.`, 4000);
  };

  /**
   * Approves an offer packet.
   */
  const approveOffer = async (id, approver = 'HR Director', notes = '') => {
    const updatedMeta = await approveOfferApi(id, approver, notes);
    setOffers((prev) =>
      prev.map((off) => {
        if (off.id.toLowerCase() === id.toLowerCase()) {
          const auditRec = buildOfferAuditRecord('Offer Approved', approver, off.status, 'Approved', notes || 'Budget approved');
          return {
            ...off,
            ...updatedMeta,
            auditTrail: [auditRec, ...(off.auditTrail || [])],
          };
        }
        return off;
      })
    );
    showToast(`Offer ${id} approved successfully.`, 4000);
  };

  /**
   * Rejects an offer packet.
   */
  const rejectOffer = async (id, rejector = 'HR Director', reason = '') => {
    const updatedMeta = await rejectOfferApi(id, rejector, reason);
    setOffers((prev) =>
      prev.map((off) => {
        if (off.id.toLowerCase() === id.toLowerCase()) {
          const auditRec = buildOfferAuditRecord('Offer Rejected', rejector, off.status, 'Rejected', reason);
          return {
            ...off,
            ...updatedMeta,
            auditTrail: [auditRec, ...(off.auditTrail || [])],
          };
        }
        return off;
      })
    );
    showToast(`Offer ${id} rejected.`, 4000);
  };

  /**
   * Marks offer as accepted by candidate.
   */
  const acceptOffer = async (id) => {
    const updatedMeta = await acceptOfferApi(id);
    setOffers((prev) =>
      prev.map((off) => {
        if (off.id.toLowerCase() === id.toLowerCase()) {
          const auditRec = buildOfferAuditRecord('Offer Accepted', off.candidateName, off.status, 'Accepted', 'Candidate digital acceptance');
          return {
            ...off,
            ...updatedMeta,
            auditTrail: [auditRec, ...(off.auditTrail || [])],
          };
        }
        return off;
      })
    );
    showToast(`Offer ${id} marked as Accepted!`, 4000);
  };

  /**
   * Marks offer as declined by candidate.
   */
  const declineOffer = async (id, reason = '') => {
    const updatedMeta = await declineOfferApi(id, reason);
    setOffers((prev) =>
      prev.map((off) => {
        if (off.id.toLowerCase() === id.toLowerCase()) {
          const auditRec = buildOfferAuditRecord('Offer Declined', off.candidateName, off.status, 'Declined', reason);
          return {
            ...off,
            ...updatedMeta,
            auditTrail: [auditRec, ...(off.auditTrail || [])],
          };
        }
        return off;
      })
    );
    showToast(`Offer ${id} marked as Declined.`, 4000);
  };

  /**
   * Resolves offer by ID.
   */
  const getOfferById = (id) => {
    if (!id) return null;
    return offers.find((off) => off.id.toLowerCase() === id.toLowerCase()) || null;
  };

  const openPreviewModal = (offer) => setPreviewModalOffer(offer);
  const closePreviewModal = () => setPreviewModalOffer(null);

  return (
    <OfferContext.Provider
      value={{
        offers,
        filteredOffers,
        templates,
        stats,
        filters,
        previewModalOffer,
        setFilters,
        resetFilters,
        generateOffer,
        reviseOffer,
        recordNegotiation,
        approveOffer,
        rejectOffer,
        acceptOffer,
        declineOffer,
        getOfferById,
        openPreviewModal,
        closePreviewModal,
      }}
    >
      {children}
    </OfferContext.Provider>
  );
}
