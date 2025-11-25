import express from 'express';
import analyticsController from '../controllers/analytics.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/analytics/engagement
 * @desc    Update engagement data (time on page, scroll depth)
 * @access  Public
 */
router.post('/engagement', analyticsController.updateEngagement);

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get dashboard analytics (Admin only)
 * @access  Private (Admin)
 */
router.get('/dashboard', authMiddleware.protect, authMiddleware.restrictTo('admin'), analyticsController.getDashboardAnalytics);

/**
 * @route   GET /api/analytics/daily
 * @desc    Get daily analytics for charts (Admin only)
 * @access  Private (Admin)
 */
router.get('/daily', authMiddleware.protect, authMiddleware.restrictTo('admin'), analyticsController.getDailyAnalytics);

/**
 * @route   GET /api/analytics/stats
 * @desc    Get visitor statistics (Admin only)
 * @access  Private (Admin)
 */
router.get('/stats', authMiddleware.protect, authMiddleware.restrictTo('admin'), analyticsController.getVisitorStats);

/**
 * @route   DELETE /api/analytics/cleanup
 * @desc    Clean up old analytics data (Admin only)
 * @access  Private (Admin)
 */
router.delete('/cleanup', authMiddleware.protect, authMiddleware.restrictTo('admin'), analyticsController.cleanupData);

export default router;