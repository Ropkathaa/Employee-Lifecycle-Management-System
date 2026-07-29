const express = require("express");
const multer = require("multer");

const {
    uploadDocument,
    uploadMultipleDocuments
} = require("../controllers/aiController");

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

// Single document validation
router.post(
    "/validate-document",
    upload.single("document"),
    uploadDocument
);

// Multiple document validation
router.post(
    "/validate-documents",
    upload.array("documents", 10),
    uploadMultipleDocuments
);

module.exports = router;