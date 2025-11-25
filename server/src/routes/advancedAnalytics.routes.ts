import express from 'express';
import advancedAnalyticsController from '../controllers/advancedAnalytics.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/analytics/advanced/report
 * @desc    Get comprehensive analytics report
 * @access  Private (Admin)
 */
router.get('/report', authMiddleware.protect, authMiddleware.restrictTo('admin'), advancedAnalyticsController.getComprehensiveReport);

/**
 * @route   GET /api/analytics/advanced/real-time
 * @desc    Get real-time analytics data
 * @access  Private (Admin)
 */
router.get('/real-time', authMiddleware.protect, authMiddleware.restrictTo('admin'), advancedAnalyticsController.getRealTimeAnalytics);

/**
 * @route   GET /api/analytics/advanced/insights
 * @desc    Get analytics insights and recommendations
 * @access  Private (Admin)
 */
router.get('/insights', authMiddleware.protect, authMiddleware.restrictTo('admin'), advancedAnalyticsController.getAnalyticsInsights);

/**
 * @route   POST /api/analytics/advanced/track
 * @desc    Track custom analytics event
 * @access  Public
 */
router.post('/track', advancedAnalyticsController.trackEvent);

/**
 * @route   POST /api/analytics/advanced/generate
 * @desc    Generate advanced analytics for a specific period
 * @access  Private (Admin)
 */
router.post('/generate', authMiddleware.protect, authMiddleware.restrictTo('admin'), advancedAnalyticsController.generatePeriodAnalytics);

export default router;