import multer from 'multer';
import path from 'path';

/**
 * Multer disk storage configuration.
 * Files are renamed using a timestamp prefix to prevent path traversal attacks.
 * Allowed MIME types: PDF, JPG, PNG. Max size: 5MB.
 */

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const UPLOAD_PATH = process.env.UPLOAD_PATH || 'src/uploads';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e5)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniquePrefix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Invalid file type. Only PDF, JPG and PNG files are permitted.');
    error.statusCode = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
});

export default upload;
