const fs = require("fs");
const FormData = require("form-data");
const { validateDocument } = require("../services/aiService");

/**
 * Safely removes temporary files uploaded by Multer.
 * @param {Object|Array} files
 */
const cleanupFiles = (files) => {
    if (!files) return;

    const fileArray = Array.isArray(files) ? files : [files];

    fileArray.forEach((file) => {
        if (file && file.path && fs.existsSync(file.path)) {
            try {
                fs.unlinkSync(file.path);
            } catch (err) {
                console.error(
                    `Failed to cleanup temp file at ${file.path}:`,
                    err.message
                );
            }
        }
    });
};

// =====================================================
// Single Document Upload
// =====================================================
const uploadDocument = async (req, res) => {
    console.log("\n========== EXPRESS (Single) ==========");
    console.log("req.body =", req.body);
    console.log("req.file =", req.file);
    console.log("======================================\n");

    try {
        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "No document uploaded."
            });
        }

        const formData = new FormData();

        formData.append(
            "document",
            fs.createReadStream(req.file.path),
            req.file.originalname
        );

        formData.append(
            "documentType",
            req.body.documentType || ""
        );

        const result = await validateDocument(
            formData,
            formData.getHeaders()
        );

        cleanupFiles(req.file);

        return res.status(200).json({
            status: "success",
            data: result
        });

    } catch (error) {

        console.error("\n========== AI SINGLE ERROR ==========");
        console.error(error);
        console.error("=====================================\n");

        cleanupFiles(req.file);

        const statusCode =
            Number.isInteger(error.status) ? error.status : 500;

        return res.status(statusCode).json({
            status: "error",
            message: error.message || "AI Validation Failed",
            details: error.data || null
        });
    }
};

// =====================================================
// Multiple Document Upload
// =====================================================
const uploadMultipleDocuments = async (req, res) => {

    console.log("\n========== EXPRESS (Multiple) ==========");
    console.log("req.body =", req.body);
    console.log("req.files =", req.files);
    console.log("========================================\n");

    try {

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "No documents uploaded."
            });
        }

        let rawTypes = req.body.documentType;
        let documentTypes = [];

        if (Array.isArray(rawTypes)) {
            documentTypes = rawTypes;
        } else if (rawTypes !== undefined && rawTypes !== null) {
            documentTypes = [rawTypes];
        }

        if (documentTypes.length !== req.files.length) {

            cleanupFiles(req.files);

            return res.status(400).json({
                status: "error",
                message:
                    "Each uploaded document must have a corresponding documentType."
            });
        }

        const results = [];

        for (let i = 0; i < req.files.length; i++) {

            const currentFile = req.files[i];

            const formData = new FormData();

            formData.append(
                "document",
                fs.createReadStream(currentFile.path),
                currentFile.originalname
            );

            formData.append(
                "documentType",
                documentTypes[i]
            );

            const result = await validateDocument(
                formData,
                formData.getHeaders()
            );

            console.log(`\n===== AI RESULT [${i + 1}] =====`);
            console.dir(result, { depth: null });
            console.log("================================\n");

            results.push(result);
        }

        cleanupFiles(req.files);

        return res.status(200).json({
            status: "success",
            totalDocuments: results.length,
            results
        });

    } catch (error) {

        console.error("\n========== AI MULTIPLE ERROR ==========");
        console.error(error);
        console.error("=======================================\n");

        cleanupFiles(req.files);

        const statusCode =
            Number.isInteger(error.status) ? error.status : 500;

        return res.status(statusCode).json({
            status: "error",
            message: error.message || "Batch validation failed.",
            details: error.data || null
        });
    }
};

module.exports = {
    uploadDocument,
    uploadMultipleDocuments
};