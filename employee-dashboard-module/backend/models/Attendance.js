const mongoose = require("mongoose");

// ======================
// Attendance Schema
// ======================
const attendanceSchema = new mongoose.Schema(
  {
    employee: { type: String, default: "You" },
    employeeId: { type: String, default: "0" },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    checkIn: { type: Date, default: null },
    checkOut: { type: Date, default: null },
    workingHours: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["present", "half_day", "absent", "leave", "weekend"],
      default: "absent",
    },
    lateEntry: { type: Boolean, default: false },
    remarks: { type: String, default: "" },
  },
  { timestamps: true }
);

// Prevent duplicate check-ins for the same employee on the same day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);

