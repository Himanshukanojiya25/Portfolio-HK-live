import express from 'express';
import adminController from '../controllers/admin.controller.js';
import projectsController from '../controllers/projects.controller.js';
import testimonialController from '../controllers/testimonial.controller.js'; // ADD THIS
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected and restricted to admin only
router.use(authMiddleware.protect, authMiddleware.restrictTo('admin'));

// ---------------------------------------------------------------
// DASHBOARD ROUTES
// ---------------------------------------------------------------

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

// ---------------------------------------------------------------
// PROJECT ROUTES
// ---------------------------------------------------------------

/**
 * @route   GET /api/admin/projects
 * @desc    Get all projects (with filtering)
 * @access  Private (Admin)
 */
router.get('/projects', projectsController.getProjects);

/**
 * @route   GET /api/admin/projects/:id
 * @desc    Get single project by ID
 * @access  Private (Admin)
 */
router.get('/projects/:id', projectsController.getProjectById);

/**
 * @route   POST /api/admin/projects
 * @desc    Create new project
 * @access  Private (Admin)
 */
router.post('/projects', projectsController.createProject);

/**
 * @route   PUT /api/admin/projects/:id
 * @desc    Update project
 * @access  Private (Admin)
 */
router.put('/projects/:id', projectsController.updateProject);

/**
 * @route   DELETE /api/admin/projects/:id
 * @desc    Delete project
 * @access  Private (Admin)
 */
router.delete('/projects/:id', projectsController.deleteProject);

/**
 * @route   GET /api/admin/projects/featured
 * @desc    Get featured projects
 * @access  Private (Admin)
 */
router.get('/projects/featured', projectsController.getFeaturedProjects);

/**
 * @route   GET /api/admin/projects/tech/:tech
 * @desc    Get projects by technology
 * @access  Private (Admin)
 */
router.get('/projects/tech/:tech', projectsController.getProjectsByTech);

/**
 * @route   POST /api/admin/projects/:id/like
 * @desc    Like a project
 * @access  Private (Admin)
 */
router.post('/projects/:id/like', projectsController.likeProject);

/**
 * @route   POST /api/admin/projects/:id/download
 * @desc    Increment download count
 * @access  Private (Admin)
 */
router.post('/projects/:id/download', projectsController.incrementDownloadCount);

// ---------------------------------------------------------------
// TESTIMONIAL ROUTES - ADDED HERE
// ---------------------------------------------------------------

/**
 * @route   GET /api/admin/testimonials
 * @desc    Get ALL testimonials (Admin only)
 * @access  Private (Admin)
 */
router.get('/testimonials', testimonialController.getAllTestimonials);

/**
 * @route   GET /api/admin/testimonials/:id
 * @desc    Get testimonial by ID (Admin can see unapproved too)
 * @access  Private (Admin)
 */
router.get('/testimonials/:id', testimonialController.getTestimonialById);

/**
 * @route   POST /api/admin/testimonials
 * @desc    Create new testimonial (Admin only)
 * @access  Private (Admin)
 */
router.post('/testimonials', testimonialController.createTestimonial);

/**
 * @route   PUT /api/admin/testimonials/:id
 * @desc    Update testimonial (Admin only)
 * @access  Private (Admin)
 */
router.put('/testimonials/:id', testimonialController.updateTestimonial);

/**
 * @route   DELETE /api/admin/testimonials/:id
 * @desc    Delete testimonial (Admin only)
 * @access  Private (Admin)
 */
router.delete('/testimonials/:id', testimonialController.deleteTestimonial);

/**
 * @route   PATCH /api/admin/testimonials/:id/approve
 * @desc    Approve testimonial (Admin only)
 * @access  Private (Admin)
 */
router.patch('/testimonials/:id/approve', testimonialController.approveTestimonial);

/**
 * @route   PATCH /api/admin/testimonials/:id/feature
 * @desc    Feature/unfeature testimonial (Admin only)
 * @access  Private (Admin)
 */
router.patch('/testimonials/:id/feature', testimonialController.featureTestimonial);

export default router;