const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Read MongoDB URI from environment
        const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

        // Validate MongoDB URI
        if (!mongoURI) {
            console.error("================================");
            console.error("❌ MongoDB Connection Failed");
            console.error("Reason : MONGO_URI is not defined.");
            console.error("Please check your .env file.");
            console.error("================================");
            process.exit(1);
        }

        // Connect to MongoDB
        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log("================================");
        console.log("✅ MongoDB Connected Successfully");
        console.log(`Host      : ${conn.connection.host}`);
        console.log(`Database  : ${conn.connection.name}`);
        console.log("================================");

        return conn;
    } catch (error) {
        console.error("================================");
        console.error("❌ MongoDB Connection Failed");
        console.error(`Reason : ${error.message}`);
        console.error("================================");
        process.exit(1);
    }
};

// Connection Events
mongoose.connection.on("connected", () => {
    console.log("🟢 MongoDB connection established.");
});

mongoose.connection.on("disconnected", () => {
    console.warn("🟡 MongoDB disconnected.");
});

mongoose.connection.on("reconnected", () => {
    console.log("🟢 MongoDB reconnected.");
});

mongoose.connection.on("error", (err) => {
    console.error("🔴 MongoDB Error:", err.message);
});

// Graceful Shutdown
process.on("SIGINT", async () => {
    try {
        await mongoose.connection.close();
        console.log("\n🛑 MongoDB connection closed.");
        process.exit(0);
    } catch (err) {
        console.error("Error while closing MongoDB:", err.message);
        process.exit(1);
    }
});

module.exports = connectDB;