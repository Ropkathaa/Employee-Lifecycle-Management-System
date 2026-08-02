import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import DocumentUploadQueue from '../components/document/DocumentUploadQueue';
import { useDocuments } from '../hooks/useDocuments';
import { useEmployees } from '../hooks/useEmployees';

export default function DocumentUpload() {
  const navigate = useNavigate();
  const { uploadDocument } = useDocuments();
  const { employees } = useEmployees();

  const handleUploadFiles = async (fileData) => {
    await uploadDocument(fileData);
    navigate('/documents');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upload Employee Documents"
        breadcrumbs={[
          { label: 'Documents', path: '/documents' },
          { label: 'Upload Documents', path: '/documents/upload' },
        ]}
      />

      <DocumentUploadQueue
        onUploadFiles={handleUploadFiles}
        employees={employees}
      />
    </div>
  );
}
