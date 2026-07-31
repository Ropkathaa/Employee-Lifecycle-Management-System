require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/database");
const aiRoutes = require("./routes/aiRoutes");

// =======================================
// Initialize Express App
// =======================================
const app = express();

// =======================================
// Environment Variables
// =======================================
console.log("================================");
console.log("Environment Variables");
console.log("--------------------------------");
console.log("PORT      :", process.env.PORT || "Not Set");
console.log("NODE_ENV  :", process.env.NODE_ENV || "Not Set");
console.log(
    "MONGO_URI :",
    process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌"
);
console.log("================================");

// =======================================
// Middleware
// =======================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// =======================================
// Debug Logger (Logs Every Incoming Request)
// =======================================
app.use((req, res, next) => {
    console.log("\n================================");
    console.log(`${req.method} ${req.originalUrl}`);
    console.log("================================");
    next();
});

// =======================================
// AI Route Debug Middleware
// =======================================
app.use("/api/ai", (req, res, next) => {
    console.log("\n========== AI ROUTE ==========");
    console.log("Method :", req.method);
    console.log("URL    :", req.originalUrl);
    console.log("==============================\n");
    next();
});

// =======================================
// Routes
// =======================================
app.use("/api/ai", aiRoutes);

// =======================================
// Root Route
// =======================================
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        application: "Employee Lifecycle Management System",
        module: "AI Integration",
        message: "Backend Server Running Successfully 🚀",
    });
});

// =======================================
// 404 Handler
// =======================================
app.use((req, res) => {
    console.log("\n========== 404 ==========");
    console.log("No route matched:");
    console.log(req.method, req.originalUrl);
    console.log("=========================\n");

    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// ===============================
// Global Error Handler
// ===============================
app.use((err, req, res, next) => {

    console.error("\n========== GLOBAL ERROR ==========");
    console.error(err);
    console.error("==================================");

    const statusCode =
        typeof err?.status === "number"
            ? err.status
            : 500;

    const message =
        err?.message || "Internal Server Error";

    const details =
        err?.data || null;

    res.status(statusCode).json({
        success: false,
        message,
        details
    });

});

// =======================================
// Start Server
// =======================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log("================================");
            console.log("🚀 Employee Lifecycle Management");
            console.log("================================");
            console.log(`Mode    : ${process.env.NODE_ENV}`);
            console.log(`Port    : ${PORT}`);
            console.log(`URL     : http://localhost:${PORT}`);
            console.log("Status  : Running Successfully ✅");
            console.log("================================");
        });
    } catch (error) {
        console.error("================================");
        console.error("❌ Server Startup Failed");
        console.error(error);
        console.error("================================");
        process.exit(1);
    }
};

startServer();

// =======================================
// Graceful Shutdown
// =======================================
process.on("SIGINT", () => {
    console.log("\n🛑 Server stopped (SIGINT)");
    process.exit(0);
});

process.on("SIGTERM", () => {
    console.log("\n🛑 Server terminated (SIGTERM)");
    process.exit(0);
});