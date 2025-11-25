import express from 'express';
import commentsController from '../controllers/comments.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/comments/blog/:blogId
 * @desc    Get comments for a blog
 * @access  Public
 */
router.get('/blog/:blogId', commentsController.getComments);

/**
 * @route   POST /api/comments/blog/:blogId
 * @desc    Create new comment
 * @access  Public
 */
router.post('/blog/:blogId', commentsController.createComment);

/**
 * @route   PATCH /api/comments/:commentId/like
 * @desc    Like a comment
 * @access  Public
 */
router.patch('/:commentId/like', commentsController.likeComment);

/**
 * @route   GET /api/comments/pending
 * @desc    Get pending comments (admin only)
 * @access  Private (Admin)
 */
router.get('/pending', authMiddleware.protect, authMiddleware.restrictTo('admin'), commentsController.getPendingComments);

/**
 * @route   PATCH /api/comments/:commentId/status
 * @desc    Update comment status (admin only)
 * @access  Private (Admin)
 */
router.patch('/:commentId/status', authMiddleware.protect, authMiddleware.restrictTo('admin'), commentsController.updateCommentStatus);

/**
 * @route   DELETE /api/comments/:commentId
 * @desc    Delete comment (admin only)
 * @access  Private (Admin)
 */
router.delete('/:commentId', authMiddleware.protect, authMiddleware.restrictTo('admin'), commentsController.deleteComment);

export default router;