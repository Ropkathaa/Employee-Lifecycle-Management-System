import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './routes/index.js';
import notFoundHandler from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// ─── Global Middleware Registration ──────────────────────────────────────────

// CORS: Only allow requests from the configured CLIENT_URL
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// HTTP Request Logger (dev format in development)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── API Version 1 Routes ─────────────────────────────────────────────────────
app.use('/api/v1', apiRouter);

// ─── Catch-All Error Handlers ─────────────────────────────────────────────────

// 404 handler - must come after all defined routes
app.use(notFoundHandler);

// Global error handler - must be the last middleware registered
app.use(errorHandler);

export default app;
