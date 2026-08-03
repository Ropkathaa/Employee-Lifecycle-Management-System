const mongoose = require("mongoose");

// ======================
// Leave Request Schema
// ======================
const leaveSchema = new mongoose.Schema(
  {
    employee: { type: String, default: "You" },
    employeeId: { type: String, default: "0" },
    type: { type: String, required: true },
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    numberOfDays: { type: Number, default: 1 },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    appliedDate: { type: String, default: "" },
    medicalCertificate: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", leaveSchema);

