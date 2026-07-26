const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: true
        },

        documentType: {
            type: String,
            required: true
        },

        fileName: {
            type: String,
            required: true
        },

        validationStatus: {
            type: String,
            enum: ["Pending", "Verified", "Rejected"],
            default: "Pending"
        },

        aiConfidence: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model("Document", documentSchema);