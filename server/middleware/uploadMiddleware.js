const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Map doc type -> subfolder
const folderMap = {
  resume: "resumes",
  experience_certificate: "experience",
  professional_certification: "certifications",
  government_id: "onboarding",
  educational_certificate: "onboarding",
  photograph: "onboarding",
  other: "onboarding",
  additional_requested: "onboarding",
};

const baseUploadDir = path.join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const docType = req.body.docType || "other";
    const subfolder = folderMap[docType] || "onboarding";
    const dest = path.join(baseUploadDir, subfolder);
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${req.candidate ? req.candidate._id : "cand"}-${Date.now()}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const allowedTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type. Allowed: PDF, DOC, DOCX, JPG, PNG."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
