const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

const routes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

// ======================
// Global Middleware
// ======================
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Uploads
app.use("/uploads", express.static("uploads"));

// ======================
// Home Route
// ======================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Employee Dashboard API is Running",
  });
});

// ======================
// Health Check
// ======================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

// ======================
// API Routes
// ======================
app.use("/api/v1/employee-dashboard", routes);

// ======================
// Error Handling
// ======================
app.use(notFound);
app.use(errorHandler);

module.exports = app;