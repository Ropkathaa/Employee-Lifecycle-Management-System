import { Router } from 'express';

const router = Router();

/**
 * GET /api/v1/health
 * Health check endpoint - verifies the server is running and reachable.
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'Enterprise HR Automation Platform API is running.',
    timestamp: new Date().toISOString(),
    version: 'v1',
    environment: process.env.NODE_ENV || 'development',
  });
});

export default router;
