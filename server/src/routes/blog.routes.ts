import express from 'express';
import blogController from '../controllers/blog.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/blogs
 * @desc    Get all published blogs
 * @access  Public
 */
router.get('/', blogController.getBlogs);

/**
 * @route   GET /api/blogs/featured
 * @desc    Get featured blogs
 * @access  Public
 */
router.get('/featured', blogController.getFeaturedBlogs);

/**
 * @route   GET /api/blogs/category/:category
 * @desc    Get blogs by category
 * @access  Public
 */
router.get('/category/:category', blogController.getBlogsByCategory);

/**
 * @route   GET /api/blogs/slug/:slug
 * @desc    Get blog by slug
 * @access  Public
 */
router.get('/slug/:slug', blogController.getBlogBySlug);

/**
 * @route   GET /api/blogs/:id
 * @desc    Get blog by ID (admin - includes drafts)
 * @access  Private (Admin)
 */
router.get('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), blogController.getBlogById);

/**
 * @route   POST /api/blogs
 * @desc    Create new blog
 * @access  Private (Admin)
 */
router.post('/', authMiddleware.protect, authMiddleware.restrictTo('admin'), blogController.createBlog);

/**
 * @route   PUT /api/blogs/:id
 * @desc    Update blog
 * @access  Private (Admin)
 */
router.put('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), blogController.updateBlog);

/**
 * @route   DELETE /api/blogs/:id
 * @desc    Delete blog
 * @access  Private (Admin)
 */
router.delete('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), blogController.deleteBlog);

/**
 * @route   PATCH /api/blogs/:id/like
 * @desc    Like a blog
 * @access  Public
 */
router.patch('/:id/like', blogController.likeBlog);

export default router;