const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: true,
            default: "TEMP_EMPLOYEE"
        },

        documentType: {
            type: String,
            required: true
        },

        fileName: {
            type: String,
            required: true
        },

        fileType: {
            type: String,
            default: ""
        },

        validationStatus: {
            type: String,
            enum: ["Pending", "VALID", "INVALID", "Verified", "Rejected"],
            default: "Pending"
        },

        aiConfidence: {
            type: Number,
            default: 0
        },

        checks: {
            filePresent: {
                type: Boolean,
                default: false
            },
            readable: {
                type: Boolean,
                default: false
            },
            supportedFormat: {
                type: Boolean,
                default: false
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Document", documentSchema);