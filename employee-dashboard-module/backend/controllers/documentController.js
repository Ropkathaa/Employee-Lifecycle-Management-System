const fs = require("fs");
const path = require("path");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const Document = require("../models/Document");
const { UPLOAD_DIR } = require("../middleware/upload");
const { DOCUMENT_STATUS } = require("../constants");
const { getCurrentEmployeeId } = require("../utils/currentEmployee");

// ======================
// Helper: delete file from disk (best-effort)
// ======================
const deleteFileFromDisk = (filePath) => {
  if (!filePath) return;
  try {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(UPLOAD_DIR, path.basename(filePath));
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch (err) {
    console.error("Failed to delete file:", err.message);
  }
};

// ======================
// GET /api/employee/documents
// @desc    Get all documents for the authenticated employee (with optional search/filter/pagination)
// ======================
const getDocuments = asyncHandler(async (req, res) => {
  const employeeId = await getCurrentEmployeeId(req);
  const { search, type, status, page = 1, limit = 10 } = req.query;

  const filter = { employeeId };

  // Search by document name
  if (search) {
    filter.documentName = { $regex: search, $options: "i" };
  }

  // Filter by document type
  if (type && type !== "all") {
    filter.documentType = type;
  }

  // Filter by status
  if (status && status !== "all") {
    filter.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Document.countDocuments(filter);
  const documents = await Document.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Map to API-friendly shape + effective status (auto-expiry)
  const data = documents.map((doc) => ({
    _id: doc._id,
    documentType: doc.documentType,
    documentName: doc.documentName,
    originalName: doc.originalName,
    fileName: doc.fileName,
    filePath: doc.filePath,
    fileSize: doc.fileSize,
    mimeType: doc.mimeType,
    status: doc.effectiveStatus,
    expiresAt: doc.expiresAt,
    employee: doc.employee,
    employeeId: doc.employeeId,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }));

  ApiResponse.paginated(res, data, total, parseInt(page), parseInt(limit), "Documents fetched successfully");
});

// ======================
// POST /api/employee/documents
// @desc    Upload a new document for the authenticated employee
// ======================
const uploadDocument = asyncHandler(async (req, res) => {
  const employeeId = await getCurrentEmployeeId(req);
  const { documentType, documentName, expiresAt, status } = req.body;

  if (!documentType || !documentName) {
    return ApiResponse.error(res, "Document type and document name are required", 400);
  }

  if (!req.file) {
    return ApiResponse.error(res, "Please upload a file", 400);
  }

  const doc = await Document.create({
    documentType,
    documentName,
    originalName: req.file.originalname,
    fileName: req.file.filename,
    filePath: req.file.path,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
    status: DOCUMENT_STATUS.UPLOADED,
    expiresAt: expiresAt || null,
    employeeId,
    ...(status ? { status } : {}),
  });

  ApiResponse.created(res, doc, "Document uploaded successfully");
});

// ======================
// PUT /api/employee/documents/:id
// @desc    Update document metadata / replace file (authenticated employee's docs only)
// ======================
const updateDocument = asyncHandler(async (req, res) => {
  const employeeId = await getCurrentEmployeeId(req);
  const doc = await Document.findOne({ _id: req.params.id, employeeId });
  if (!doc) {
    return ApiResponse.error(res, "Document not found", 404);
  }

  const { documentType, documentName, status, expiresAt } = req.body;

  // Update metadata fields
  if (documentType !== undefined) doc.documentType = documentType;
  if (documentName !== undefined) doc.documentName = documentName;
  if (status !== undefined && Object.values(DOCUMENT_STATUS).includes(status)) {
    doc.status = status;
  }
  if (expiresAt !== undefined) doc.expiresAt = expiresAt;

  // If a new file was uploaded, replace the old one
  if (req.file) {
    const oldFilePath = doc.filePath;
    doc.originalName = req.file.originalname;
    doc.fileName = req.file.filename;
    doc.filePath = req.file.path;
    doc.fileSize = req.file.size;
    doc.mimeType = req.file.mimetype;
    deleteFileFromDisk(oldFilePath);
  }

  const updatedDoc = await doc.save();
  ApiResponse.success(res, updatedDoc, "Document updated successfully");
});

// ======================
// DELETE /api/employee/documents/:id
// @desc    Delete a document (removes file from disk too) - authenticated employee's docs only
// ======================
const deleteDocument = asyncHandler(async (req, res) => {
  const employeeId = await getCurrentEmployeeId(req);
  const doc = await Document.findOne({ _id: req.params.id, employeeId });
  if (!doc) {
    return ApiResponse.error(res, "Document not found", 404);
  }

  deleteFileFromDisk(doc.filePath);
  await doc.deleteOne();
  ApiResponse.success(res, null, "Document deleted successfully");
});

// ======================
// POST /api/employee/documents/bulk
// @desc    Upload/replace multiple documents in a single request (authenticated employee)
// ======================
const bulkUploadDocuments = asyncHandler(async (req, res) => {
  const employeeId = await getCurrentEmployeeId(req);
  const files = req.files || [];

  // Multer places non-file fields in req.body as strings
  let documents = req.body.documents;
  if (typeof documents === "string") {
    try {
      documents = JSON.parse(documents);
    } catch (err) {
      return ApiResponse.error(res, "Invalid documents metadata", 400);
    }
  }

  if (!Array.isArray(documents) || documents.length === 0) {
    return ApiResponse.error(res, "No documents metadata provided", 400);
  }

  if (files.length === 0) {
    return ApiResponse.error(res, "Please select at least one file to upload", 400);
  }

  if (files.length !== documents.length) {
    return ApiResponse.error(res, "File count and document count do not match", 400);
  }

  const uploaded = [];
  const errors = [];

  for (let i = 0; i < documents.length; i++) {
    const meta = documents[i] || {};
    const file = files[i];
    const { documentType, documentName, documentId } = meta;

    try {
      if (!documentType || !documentName) {
        throw new Error("Document type and document name are required");
      }

      let doc = null;

      // If a documentId is provided, try to update the existing document (only if it belongs to the employee)
      if (documentId) {
        doc = await Document.findOne({ _id: documentId, employeeId });
      }

      if (doc) {
        // Replace existing document file
        const oldFilePath = doc.filePath;
        doc.originalName = file.originalname;
        doc.fileName = file.filename;
        doc.filePath = file.path;
        doc.fileSize = file.size;
        doc.mimeType = file.mimetype;
        doc.status = DOCUMENT_STATUS.UPLOADED;
        await doc.save();
        deleteFileFromDisk(oldFilePath);
      } else {
        // Create a new document
        doc = await Document.create({
          documentType,
          documentName,
          originalName: file.originalname,
          fileName: file.filename,
          filePath: file.path,
          fileSize: file.size,
          mimeType: file.mimetype,
          status: DOCUMENT_STATUS.UPLOADED,
          employeeId,
        });
      }

      uploaded.push(doc);
    } catch (err) {
      // Clean up the uploaded file on failure
      if (file && file.path) {
        deleteFileFromDisk(file.path);
      }
      errors.push({
        documentType: meta.documentType || "unknown",
        documentName: meta.documentName || "unknown",
        message: err.message,
      });
    }
  }

  if (uploaded.length === 0) {
    return ApiResponse.error(res, "None of the documents could be uploaded", 400, errors);
  }

  const message =
    errors.length > 0
      ? `Uploaded ${uploaded.length} document(s), ${errors.length} failed`
      : `${uploaded.length} document(s) uploaded successfully`;

  return ApiResponse.success(res, uploaded, message, 200);
});

// ======================
// GET /api/employee/documents/:id/download
// @desc    Download a document (use ?inline=true for preview)
// ======================
const downloadDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) {
    return ApiResponse.error(res, "Document not found", 404);
  }

  const absolutePath = path.isAbsolute(doc.filePath)
    ? doc.filePath
    : path.join(UPLOAD_DIR, path.basename(doc.filePath));

  if (!fs.existsSync(absolutePath)) {
    return ApiResponse.error(res, "File not found on server", 404);
  }

  const inline = req.query.inline === "true";
  res.setHeader(
    "Content-Disposition",
    `${inline ? "inline" : "attachment"}; filename="${encodeURIComponent(doc.originalName)}"`
  );
  res.setHeader("Content-Type", doc.mimeType || "application/octet-stream");
  res.setHeader("Content-Length", fs.statSync(absolutePath).size);
  fs.createReadStream(absolutePath).pipe(res);
});

module.exports = {
  getDocuments,
  uploadDocument,
  bulkUploadDocuments,
  updateDocument,
  deleteDocument,
  downloadDocument,
};

