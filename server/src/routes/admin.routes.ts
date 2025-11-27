import express from 'express';
import adminController from '../controllers/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected and restricted to admin only
router.use(authMiddleware.protect, authMiddleware.restrictTo('admin'));

/**
 * @route   GET /api/admin/dashboard/stats
 * @desc    Get dashboard overview statistics
 * @access  Private (Admin)
 */
router.get('/dashboard/stats', adminController.getDashboardStats);

/**
 * @route   GET /api/admin/analytics
 * @desc    Get analytics data for charts
 * @access  Private (Admin)
 */
router.get('/analytics', adminController.getAnalyticsData);

/**
 * @route   GET /api/admin/content/overview
 * @desc    Get content management overview
 * @access  Private (Admin)
 */
router.get('/content/overview', adminController.getContentOverview);

/**
 * @route   GET /api/admin/system/metrics
 * @desc    Get system health and performance metrics
 * @access  Private (Admin)
 */
router.get('/system/metrics', adminController.getSystemMetrics);

/**
 * @route   GET /api/admin/quick-actions
 * @desc    Get quick actions data
 * @access  Private (Admin)
 */
router.get('/quick-actions', adminController.getQuickActions);

export default router;