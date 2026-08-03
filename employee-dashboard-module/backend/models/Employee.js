const mongoose = require("mongoose");

// ======================
// Employee / Profile Schema
// ======================
const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    department: { type: String, default: "" },
    position: { type: String, default: "" },
    employeeId: { type: String, required: true, unique: true },
    joinDate: { type: String, default: "" },
    avatar: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);

