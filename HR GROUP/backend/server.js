import 'dotenv/config';
import app from './src/app.js';
import { connectDatabase } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

/**
 * Bootstrap the server.
 * 1. Connect to MongoDB.
 * 2. Start the HTTP listener.
 */
async function startServer() {
  try {
    // Connect to MongoDB first
    await connectDatabase();

    // Start Express HTTP server
    app.listen(PORT, () => {
      console.log('─────────────────────────────────────────────────');
      console.log(` HR Automation Platform API`);
      console.log(` Environment : ${process.env.NODE_ENV || 'development'}`);
      console.log(` Port        : ${PORT}`);
      console.log(` Health      : http://localhost:${PORT}/api/v1/health`);
      console.log('─────────────────────────────────────────────────');
    });
  } catch (error) {
    console.error(`Server bootstrap failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Handle uncaught exceptions globally
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  process.exit(1);
});

startServer();
