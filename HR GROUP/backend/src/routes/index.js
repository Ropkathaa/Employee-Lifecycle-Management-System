import { Router } from 'express';
import healthRoutes from './healthRoutes.js';

/**
 * Central API Router v1.
 * All module routes will be registered here under /api/v1.
 * Example for future modules:
 *   import employeeRoutes from './employeeRoutes.js';
 *   router.use('/employees', employeeRoutes);
 */
const router = Router();

// Health check route
router.use('/health', healthRoutes);

// Future module routes registered here (Phase 5+)
// router.use('/employees', employeeRoutes);
// router.use('/documents', documentRoutes);
// router.use('/trainings', trainingRoutes);

export default router;
