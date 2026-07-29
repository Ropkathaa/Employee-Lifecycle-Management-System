const mongoose = require("mongoose");

const validationSchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true
        },

        selectedDocumentType: {
            type: String,
            required: true
        },

        detectedDocumentType: {
            type: String
        },

        detectedCategory: {
            type: String
        },

        confidence: {
            type: Number
        },

        integrity: {
            type: mongoose.Schema.Types.Mixed
        },

        ocr: {
            type: mongoose.Schema.Types.Mixed
        },

        xai: {
            type: mongoose.Schema.Types.Mixed
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model("Validation", validationSchema);