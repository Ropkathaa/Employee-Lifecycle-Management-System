/**
 * mock/documents.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Initial seed data arrays and category definitions for Document Management.
 * Pure seed arrays ONLY; NO state or CRUD logic.
 */

export const DOCUMENT_CATEGORIES = {
  'Government ID': ['Aadhaar Card', 'PAN Card', 'Passport', 'Driving License'],
  'Education': ['10th Marksheet', '12th Marksheet', 'Graduation Degree', 'Post Graduation Degree', 'Certificates'],
  'Employment': ['Resume', 'Offer Letter', 'Experience Letter', 'Relieving Letter', 'Salary Slips'],
  'Compliance': ['NDA Agreement', 'Background Verification', 'Medical Certificate'],
  'Other': ['Miscellaneous'],
};

export const VERIFICATION_STATUSES = [
  'Verified',
  'Pending',
  'Rejected',
  'Expired',
  'Needs Update',
];

export const EXPIRY_STATUSES = [
  'Valid',
  'Expiring Soon',
  'Expired',
];

export const mockDocuments = [
  {
    id: 'DOC-2026-0001',
    employeeId: 'EMP-2026-0014',
    employeeName: 'Arjun Mehta',
    department: 'Engineering',
    category: 'Government ID',
    type: 'Aadhaar Card',
    name: 'Aadhaar_Card_Arjun.pdf',
    sizeBytes: 1258291, // ~1.2 MB
    format: 'PDF',
    uploadDate: '2026-07-15',
    expiryDate: '2036-07-15',
    status: 'Verified',
    version: 1,
    uploadedBy: 'Arjun Mehta',
    verifiedBy: 'Priya Sharma (HR)',
    notes: 'Identity verified against government database.',
    versions: [
      { version: 1, name: 'Aadhaar_Card_Arjun.pdf', uploadDate: '2026-07-15', uploadedBy: 'Arjun Mehta', sizeBytes: 1258291 },
    ],
    previewUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 'DOC-2026-0002',
    employeeId: 'EMP-2026-0014',
    employeeName: 'Arjun Mehta',
    department: 'Engineering',
    category: 'Employment',
    type: 'Offer Letter',
    name: 'Offer_Letter_Signed.pdf',
    sizeBytes: 870400, // ~850 KB
    format: 'PDF',
    uploadDate: '2026-07-15',
    expiryDate: null,
    status: 'Verified',
    version: 1,
    uploadedBy: 'Priya Sharma (HR)',
    verifiedBy: 'Priya Sharma (HR)',
    notes: 'Signed offer letter received.',
    versions: [
      { version: 1, name: 'Offer_Letter_Signed.pdf', uploadDate: '2026-07-15', uploadedBy: 'Priya Sharma (HR)', sizeBytes: 870400 },
    ],
    previewUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 'DOC-2026-0003',
    employeeId: 'EMP-2026-0013',
    employeeName: 'Priya Sharma',
    department: 'Human Resources',
    category: 'Government ID',
    type: 'PAN Card',
    name: 'PAN_Card_Priya.pdf',
    sizeBytes: 921600, // ~900 KB
    format: 'PDF',
    uploadDate: '2026-07-10',
    expiryDate: '2030-12-31',
    status: 'Verified',
    version: 1,
    uploadedBy: 'Priya Sharma',
    verifiedBy: 'System Auto-Verify',
    notes: 'PAN number matched.',
    versions: [
      { version: 1, name: 'PAN_Card_Priya.pdf', uploadDate: '2026-07-10', uploadedBy: 'Priya Sharma', sizeBytes: 921600 },
    ],
    previewUrl: '',
  },
  {
    id: 'DOC-2026-0004',
    employeeId: 'EMP-2026-0012',
    employeeName: 'Rahul Nair',
    department: 'Finance',
    category: 'Compliance',
    type: 'Medical Certificate',
    name: 'Medical_Checkup_Report.jpg',
    sizeBytes: 2411724, // ~2.3 MB
    format: 'JPG',
    uploadDate: '2026-07-25',
    expiryDate: '2026-08-15', // Expiring Soon (< 30 days)
    status: 'Pending',
    version: 1,
    uploadedBy: 'Rahul Nair',
    verifiedBy: null,
    notes: 'Awaiting HR verification for fitness compliance.',
    versions: [
      { version: 1, name: 'Medical_Checkup_Report.jpg', uploadDate: '2026-07-25', uploadedBy: 'Rahul Nair', sizeBytes: 2411724 },
    ],
    previewUrl: '',
  },
  {
    id: 'DOC-2026-0005',
    employeeId: 'EMP-2026-0011',
    employeeName: 'Sneha Kulkarni',
    department: 'Product',
    category: 'Government ID',
    type: 'Passport',
    name: 'Passport_Copy_Old.pdf',
    sizeBytes: 1572864, // ~1.5 MB
    format: 'PDF',
    uploadDate: '2026-01-10',
    expiryDate: '2026-06-01', // Expired
    status: 'Expired',
    version: 2,
    uploadedBy: 'Sneha Kulkarni',
    verifiedBy: 'Priya Sharma (HR)',
    notes: 'Passport expired in June 2026. Renewal requested.',
    versions: [
      { version: 1, name: 'Passport_v1.pdf', uploadDate: '2021-06-01', uploadedBy: 'Sneha Kulkarni', sizeBytes: 1400000 },
      { version: 2, name: 'Passport_Copy_Old.pdf', uploadDate: '2026-01-10', uploadedBy: 'Sneha Kulkarni', sizeBytes: 1572864 },
    ],
    previewUrl: '',
  },
  {
    id: 'DOC-2026-0006',
    employeeId: 'EMP-2026-0010',
    employeeName: 'Vikram Joshi',
    department: 'Engineering',
    category: 'Education',
    type: 'Graduation Degree',
    name: 'BTech_Degree_Certificate.pdf',
    sizeBytes: 3145728, // ~3.0 MB
    format: 'PDF',
    uploadDate: '2026-07-27',
    expiryDate: null,
    status: 'Rejected',
    version: 1,
    uploadedBy: 'Vikram Joshi',
    verifiedBy: 'Admin User',
    notes: 'Document blur. Please re-upload a clear high-res scan.',
    versions: [
      { version: 1, name: 'BTech_Degree_Certificate.pdf', uploadDate: '2026-07-27', uploadedBy: 'Vikram Joshi', sizeBytes: 3145728 },
    ],
    previewUrl: '',
  },
];
