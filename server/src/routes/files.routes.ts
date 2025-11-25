import express from 'express';
import filesController from '../controllers/files.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import uploadMiddleware from '../middleware/upload.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/files/upload
 * @desc    Upload single file
 * @access  Private (Admin)
 */
router.post(
  '/upload',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  uploadMiddleware.single('file'),
  filesController.uploadFile
);

/**
 * @route   POST /api/files/upload-multiple
 * @desc    Upload multiple files
 * @access  Private (Admin)
 */
router.post(
  '/upload-multiple',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  uploadMiddleware.multiple('files', 10),
  filesController.uploadMultipleFiles
);

/**
 * @route   GET /api/files
 * @desc    Get all files (public files for guests, all for admin)
 * @access  Public (filtered) / Private (Admin - all files)
 */
router.get('/', filesController.getFiles);

/**
 * @route   GET /api/files/:id
 * @desc    Get file by ID
 * @access  Public
 */
router.get('/:id', filesController.getFileById);

/**
 * @route   PUT /api/files/:id
 * @desc    Update file metadata
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  filesController.updateFile
);

/**
 * @route   DELETE /api/files/:id
 * @desc    Delete file
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  filesController.deleteFile
);

export default router;