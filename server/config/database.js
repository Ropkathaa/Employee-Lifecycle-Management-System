const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);

        console.log("================================");
        console.log("✅ MongoDB Connected");
        console.log(`Database: ${connection.connection.name}`);
        console.log("================================");

    } catch (error) {
        console.error("❌ Database Connection Failed");
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;