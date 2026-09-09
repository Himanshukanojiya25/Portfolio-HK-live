import { Router } from 'express';
import analyticsController from '../controllers/analytics.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

// Public routes (tracking events)
router.post('/track', analyticsController.trackEvent);

// Protected routes (admin only)
router.use(authMiddleware.protect, authMiddleware.restrictTo('admin'));

// Analytics endpoints
router.get('/summary', analyticsController.getSummary);
router.get('/time-series', analyticsController.getTimeSeries);
router.get('/top-pages', analyticsController.getTopPages);
router.get('/device-breakdown', analyticsController.getDeviceBreakdown);
router.get('/locations', analyticsController.getLocationData);
router.get('/real-time', analyticsController.getRealTimeVisitors);
router.get('/export', analyticsController.exportData);
router.get('/visitor/:visitorId', analyticsController.getVisitorDetails);
router.get('/journey/:sessionId', analyticsController.getVisitorJourney);

export default router;