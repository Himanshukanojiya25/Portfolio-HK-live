import express from 'express';
import projectsController from '../controllers/projects.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/projects
 * @desc    Get all projects (admin can see all, public sees only isPublic: true)
 * @access  Public (with admin query param)
 */
router.get('/', projectsController.getProjects);

/**
 * @route   GET /api/projects/featured
 * @desc    Get featured projects (public only)
 * @access  Public
 */
router.get('/featured', projectsController.getFeaturedProjects);

/**
 * @route   GET /api/projects/tech/:tech
 * @desc    Get projects by technology (public only)
 * @access  Public
 */
router.get('/tech/:tech', projectsController.getProjectsByTech);

/**
 * @route   GET /api/projects/:id
 * @desc    Get project by ID (admin can see all, public sees only isPublic: true)
 * @access  Public (with admin query param)
 */
router.get('/:id', projectsController.getProjectById);

/**
 * @route   POST /api/projects
 * @desc    Create new project
 * @access  Private (Admin)
 */
router.post('/', authMiddleware.protect, authMiddleware.restrictTo('admin'), projectsController.createProject);

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project
 * @access  Private (Admin)
 */
router.put('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), projectsController.updateProject);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project
 * @access  Private (Admin)
 */
router.delete('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), projectsController.deleteProject);

/**
 * @route   PATCH /api/projects/:id/like
 * @desc    Like a project
 * @access  Public
 */
router.patch('/:id/like', projectsController.likeProject);

/**
 * @route   PATCH /api/projects/:id/download
 * @desc    Increment download count
 * @access  Public
 */
router.patch('/:id/download', projectsController.incrementDownloadCount);

export default router;