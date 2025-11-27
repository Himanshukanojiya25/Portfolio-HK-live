import express from 'express';
import contactController from '../controllers/contact.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route - anyone can submit contact form
router.post('/', contactController.createContact);

// Admin protected routes - for managing contact messages
router.use(authMiddleware.protect, authMiddleware.restrictTo('admin'));

/**
 * @route   GET /api/contact/admin/messages
 * @desc    Get all contact messages (Admin only)
 * @access  Private (Admin)
 */
router.get('/admin/messages', contactController.getAllContacts);

/**
 * @route   GET /api/contact/admin/messages/:id
 * @desc    Get contact message by ID (Admin only)
 * @access  Private (Admin)
 */
router.get('/admin/messages/:id', contactController.getContactById);

/**
 * @route   PATCH /api/contact/admin/messages/:id/read
 * @desc    Mark contact as read (Admin only)
 * @access  Private (Admin)
 */
router.patch('/admin/messages/:id/read', contactController.markAsRead);

/**
 * @route   PATCH /api/contact/admin/messages/:id/replied
 * @desc    Mark contact as replied (Admin only)
 * @access  Private (Admin)
 */
router.patch('/admin/messages/:id/replied', contactController.markAsReplied);

export default router;