/**
 * Middleware to capture unmatched endpoints and return a standard HTTP 404 response.
 */
export default function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
}
