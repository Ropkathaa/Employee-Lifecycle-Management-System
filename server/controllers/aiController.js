const fs = require("fs");
const FormData = require("form-data");

const {
    validateDocument
} = require("../services/aiService");

// ===============================
// Single Document Upload
// ===============================
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

        return res.status(200).json(result);

    } catch (error) {

        console.error("AI Controller Error:", error);

        return res.status(500).json({
            status: "error",
            message: error.message || "AI Validation Failed"
        });
    }
};

// ===============================
// Multiple Document Upload
// ===============================
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

        const documentTypes = Array.isArray(req.body.documentType)
            ? req.body.documentType
            : [req.body.documentType];

        if (documentTypes.length !== req.files.length) {
            return res.status(400).json({
                status: "error",
                message: "Each uploaded document must have a corresponding documentType."
            });
        }

        const results = [];

        for (let i = 0; i < req.files.length; i++) {

            const formData = new FormData();

            formData.append(
                "document",
                fs.createReadStream(req.files[i].path),
                req.files[i].originalname
            );

            formData.append(
                "documentType",
                documentTypes[i]
            );

            const result = await validateDocument(
                formData,
                formData.getHeaders()
            );
            console.log("\n===== AI RESULT =====");
            console.dir(result, { depth: null });
            console.log("=====================\n");

            results.push(result);
        }

        return res.status(200).json({
            status: "success",
            totalDocuments: results.length,
            results
        });

    } catch (error) {

        console.error("AI Multiple Controller Error:", error);

        return res.status(500).json({
            status: "error",
            message: error.message || "Batch validation failed."
        });
    }
};

module.exports = {
    uploadDocument,
    uploadMultipleDocuments
};