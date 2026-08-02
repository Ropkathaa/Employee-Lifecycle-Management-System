/**
 * Global Express Exception Handler.
 * Catches all runtime errors, formats, and returns structured JSON responses.
 */
export default function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Structured logging of exceptions
  console.error({
    timestamp: new Date().toISOString(),
    message: err.message,
    statusCode,
    path: req.originalUrl,
    method: req.method,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });

  res.status(statusCode).json({
    success: false,
    message: message,
    errors: err.errors || [],
  });
}
