import express from 'express';
import contactController from '../controllers/contact.controller.js';

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Create new contact submission
 * @access  Public
 */
router.post('/', contactController.createContact);

/**
 * @route   GET /api/contact
 * @desc    Get all contacts (Admin only - will add auth middleware later)
 * @access  Private (Admin)
 */
router.get('/', contactController.getAllContacts);

/**
 * @route   GET /api/contact/:id
 * @desc    Get contact by ID (Admin only)
 * @access  Private (Admin)
 */
router.get('/:id', contactController.getContactById);

/**
 * @route   PATCH /api/contact/:id/read
 * @desc    Mark contact as read (Admin only)
 * @access  Private (Admin)
 */
router.patch('/:id/read', contactController.markAsRead);

/**
 * @route   PATCH /api/contact/:id/replied
 * @desc    Mark contact as replied (Admin only)
 * @access  Private (Admin)
 */
router.patch('/:id/replied', contactController.markAsReplied);

export default router;