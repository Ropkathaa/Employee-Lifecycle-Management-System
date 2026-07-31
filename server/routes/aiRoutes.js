const express = require("express");
const multer = require("multer");
const FormData = require("form-data");

const { validateDocument } = require("../services/aiService");

const router = express.Router();

// Store uploaded files in memory
const upload = multer({
    storage: multer.memoryStorage()
});

// Test Route
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "AI Router Working"
    });
});

// Validate Multiple Documents
router.post(
    "/validate-documents",
    upload.array("documents"),
    async (req, res) => {

        try {

            console.log("✅ POST /validate-documents reached");

            const formData = new FormData();

            // Forward uploaded files to Flask
            if (req.files && req.files.length > 0) {

                req.files.forEach(file => {

                    formData.append(
                        "documents",
                        file.buffer,
                        {
                            filename: file.originalname,
                            contentType: file.mimetype
                        }
                    );

                });

            }

            // Forward all form fields
            Object.keys(req.body).forEach(key => {

                const value = req.body[key];

                if (Array.isArray(value)) {

                    value.forEach(v => formData.append(key, v));

                } else {

                    formData.append(key, value);

                }

            });

            const result = await validateDocument(
                formData,
                formData.getHeaders()
            );

            res.status(200).json(result);

        } catch (error) {

            console.error(error);

            res.status(error.status || 500).json({
                status: "error",
                message: error.message || "AI Validation Failed"
            });

        }

    }
);

module.exports = router;