import express from 'express';
import testimonialController from '../controllers/testimonial.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// =========== PUBLIC ROUTES ===========
/**
 * @route   GET /api/testimonials
 * @desc    Get all approved testimonials (public)
 * @access  Public
 */
router.get('/', testimonialController.getApprovedTestimonials);

/**
 * @route   GET /api/testimonials/:id
 * @desc    Get testimonial by ID (public - only approved)
 * @access  Public
 */
router.get('/:id', testimonialController.getTestimonialById);

// =========== ADMIN ROUTES ===========
// Admin middleware for all routes below
router.use(authMiddleware.protect, authMiddleware.restrictTo('admin'));

/**
 * @route   GET /api/testimonials/admin/all
 * @desc    Get ALL testimonials including unapproved (Admin only)
 * @access  Private (Admin)
 */
router.get('/admin/all', testimonialController.getAllTestimonials);

/**
 * @route   POST /api/testimonials
 * @desc    Create new testimonial (Admin only)
 * @access  Private (Admin)
 */
router.post('/', testimonialController.createTestimonial);

/**
 * @route   PUT /api/testimonials/:id
 * @desc    Update testimonial (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id', testimonialController.updateTestimonial);

/**
 * @route   DELETE /api/testimonials/:id
 * @desc    Delete testimonial (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', testimonialController.deleteTestimonial);

/**
 * @route   PATCH /api/testimonials/:id/approve
 * @desc    Approve testimonial (Admin only)
 * @access  Private (Admin)
 */
router.patch('/:id/approve', testimonialController.approveTestimonial);

/**
 * @route   PATCH /api/testimonials/:id/feature
 * @desc    Feature/unfeature testimonial (Admin only)
 * @access  Private (Admin)
 */
router.patch('/:id/feature', testimonialController.featureTestimonial);

export default router;