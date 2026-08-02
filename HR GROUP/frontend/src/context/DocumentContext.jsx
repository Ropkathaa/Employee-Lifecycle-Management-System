import React, { createContext, useState, useEffect, useMemo } from 'react';
import {
  fetchDocuments,
  uploadDocumentApi,
  verifyDocumentApi,
  deleteDocumentApi,
} from '../services/documentService';
import {
  generateDocumentId,
  calculateDocumentStats,
  formatFileSize,
} from '../utils/documentHelpers';
import { useEmployees } from '../hooks/useEmployees';

export const DocumentContext = createContext(null);

/**
 * Single Source of Truth for Employee Document Domain State.
 */
export function DocumentProvider({ children }) {
  const { showToast } = useEmployees();
  const [documents, setDocuments] = useState([]);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [previewModalDoc, setPreviewModalDoc] = useState(null);

  // Filters State
  const [filters, setFiltersState] = useState({
    searchTerm: '',
    employeeId: '',
    department: '',
    category: '',
    status: '',
    expiryFilter: '',
    sortField: 'uploadDate',
    sortDirection: 'desc',
  });

  // Initial Data Fetch
  useEffect(() => {
    fetchDocuments().then((data) => setDocuments(data));
  }, []);

  const setFilters = (newFilters) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState({
      searchTerm: '',
      employeeId: '',
      department: '',
      category: '',
      status: '',
      expiryFilter: '',
      sortField: 'uploadDate',
      sortDirection: 'desc',
    });
  };

  // Computed Document Stats
  const stats = useMemo(() => calculateDocumentStats(documents), [documents]);

  // Filtered & Sorted Documents
  const filteredDocuments = useMemo(() => {
    let result = [...documents];
    const { searchTerm, employeeId, department, category, status, expiryFilter, sortField, sortDirection } = filters;

    const searchStr = typeof searchTerm === 'string' ? searchTerm : String(searchTerm || '');
    if (searchStr.trim()) {
      const q = searchStr.toLowerCase();
      result = result.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.employeeName.toLowerCase().includes(q) ||
          doc.employeeId.toLowerCase().includes(q) ||
          doc.type.toLowerCase().includes(q)
      );
    }

    if (employeeId) {
      result = result.filter((doc) => doc.employeeId === employeeId);
    }

    if (department) {
      result = result.filter((doc) => doc.department === department);
    }

    if (category) {
      result = result.filter((doc) => doc.category === category);
    }

    if (status) {
      result = result.filter((doc) => doc.status === status);
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
  }, [documents, filters]);

  /**
   * Uploads a new document or new version.
   */
  const uploadDocument = async (newDocData) => {
    const formattedDoc = {
      ...newDocData,
      id: newDocData.id || generateDocumentId(documents),
      uploadDate: new Date().toISOString().split('T')[0],
      status: newDocData.status || 'Pending',
      version: 1,
      sizeBytes: newDocData.sizeBytes || 1048576,
      format: newDocData.format || 'PDF',
      versions: [
        {
          version: 1,
          name: newDocData.name,
          uploadDate: new Date().toISOString().split('T')[0],
          uploadedBy: newDocData.uploadedBy || 'Admin User',
          sizeBytes: newDocData.sizeBytes || 1048576,
        },
      ],
    };

    const uploaded = await uploadDocumentApi(formattedDoc);
    setDocuments((prev) => [uploaded, ...prev]);
    showToast('Document uploaded successfully.', 4000);
    return uploaded;
  };

  /**
   * Verifies document (Approve, Reject, Request Update).
   */
  const verifyDocument = async (id, status, notes = '') => {
    const updatedMeta = await verifyDocumentApi(id, status, notes);
    setDocuments((prev) =>
      prev.map((doc) => (doc.id.toLowerCase() === id.toLowerCase() ? { ...doc, ...updatedMeta } : doc))
    );
    showToast(`Document verification status updated to ${status}.`, 4000);
  };

  /**
   * Deletes document from state.
   */
  const deleteDocument = async (id) => {
    await deleteDocumentApi(id);
    setDocuments((prev) => prev.filter((doc) => doc.id.toLowerCase() !== id.toLowerCase()));
    showToast('Document deleted.', 4000);
  };

  /**
   * Resolves document by ID.
   */
  const getDocumentById = (id) => {
    if (!id) return null;
    return documents.find((doc) => doc.id.toLowerCase() === id.toLowerCase()) || null;
  };

  const openPreviewModal = (doc) => setPreviewModalDoc(doc);
  const closePreviewModal = () => setPreviewModalDoc(null);

  return (
    <DocumentContext.Provider
      value={{
        documents,
        filteredDocuments,
        stats,
        uploadQueue,
        filters,
        previewModalDoc,
        setFilters,
        resetFilters,
        uploadDocument,
        verifyDocument,
        deleteDocument,
        getDocumentById,
        openPreviewModal,
        closePreviewModal,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}
