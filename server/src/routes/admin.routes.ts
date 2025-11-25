import express from 'express';
import adminController from '../controllers/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/admin/dashboard/stats
 * @desc    Get dashboard overview statistics
 * @access  Private (Admin)
 */
router.get('/dashboard/stats', authMiddleware.protect, authMiddleware.restrictTo('admin'), adminController.getDashboardStats);

/**
 * @route   GET /api/admin/analytics
 * @desc    Get analytics data for charts
 * @access  Private (Admin)
 */
router.get('/analytics', authMiddleware.protect, authMiddleware.restrictTo('admin'), adminController.getAnalyticsData);

/**
 * @route   GET /api/admin/content/overview
 * @desc    Get content management overview
 * @access  Private (Admin)
 */
router.get('/content/overview', authMiddleware.protect, authMiddleware.restrictTo('admin'), adminController.getContentOverview);

/**
 * @route   GET /api/admin/system/metrics
 * @desc    Get system health and performance metrics
 * @access  Private (Admin)
 */
router.get('/system/metrics', authMiddleware.protect, authMiddleware.restrictTo('admin'), adminController.getSystemMetrics);

export default router;