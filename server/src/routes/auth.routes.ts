import express from 'express';
import authController from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// ✅ ONLY THESE ROUTES - jo controllers actually exist
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware.protect, authController.getProfile);

export default router;