import express from 'express';
import resumeController from '../controllers/resume.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/resume
 * @desc    Get public resume
 * @access  Public
 */
router.get('/', resumeController.getResume);

/**
 * @route   GET /api/resume/admin
 * @desc    Get resume for admin (with private data)
 * @access  Private (Admin)
 */
router.get('/admin', authMiddleware.protect, authMiddleware.restrictTo('admin'), resumeController.getAdminResume);

/**
 * @route   PUT /api/resume
 * @desc    Update resume
 * @access  Private (Admin)
 */
router.put('/', authMiddleware.protect, authMiddleware.restrictTo('admin'), resumeController.updateResume);

/**
 * @route   POST /api/resume/experiences
 * @desc    Add experience to resume
 * @access  Private (Admin)
 */
router.post('/experiences', authMiddleware.protect, authMiddleware.restrictTo('admin'), resumeController.addExperience);

/**
 * @route   POST /api/resume/educations
 * @desc    Add education to resume
 * @access  Private (Admin)
 */
router.post('/educations', authMiddleware.protect, authMiddleware.restrictTo('admin'), resumeController.addEducation);

/**
 * @route   PUT /api/resume/experiences/:id
 * @desc    Update experience
 * @access  Private (Admin)
 */
router.put('/experiences/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), resumeController.updateExperience);

/**
 * @route   PUT /api/resume/educations/:id
 * @desc    Update education
 * @access  Private (Admin)
 */
router.put('/educations/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), resumeController.updateEducation);

/**
 * @route   DELETE /api/resume/experiences/:id
 * @desc    Delete experience
 * @access  Private (Admin)
 */
router.delete('/experiences/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), resumeController.deleteExperience);

/**
 * @route   DELETE /api/resume/educations/:id
 * @desc    Delete education
 * @access  Private (Admin)
 */
router.delete('/educations/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), resumeController.deleteEducation);

/**
 * @route   PATCH /api/resume/download
 * @desc    Increment download count
 * @access  Public
 */
router.patch('/download', resumeController.incrementDownloadCount);

export default router;