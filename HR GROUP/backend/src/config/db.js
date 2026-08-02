import mongoose from 'mongoose';

/**
 * Initializes and establishes connection to the MongoDB instance.
 */
export async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/hr_automation';
  
  try {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB successfully connected to database instance.');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB connection has disconnected.');
    });

    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error(`MongoDB bootstrap initialization failed: ${error.message}`);
    process.exit(1);
  }
}
