
const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const morgan = require("morgan");
const aiRoutes = require("./routes/aiRoutes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        application: "Employee Lifecycle Management System",
        module: "AI Integration",
        message: "Backend Server Running Successfully 🚀"
    });
});
console.log("MONGO_URI:", process.env.MONGO_URI);
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("================================");
    console.log(`🚀 Server running on Port ${PORT}`);
    console.log("================================");
});