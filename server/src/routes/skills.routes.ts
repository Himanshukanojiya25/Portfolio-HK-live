import express from 'express';
import skillsController from '../controllers/skills.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/skills
 * @desc    Get all skills
 * @access  Public
 */
router.get('/', skillsController.getSkills);

/**
 * @route   GET /api/skills/:id
 * @desc    Get skill by ID
 * @access  Public
 */
router.get('/:id', skillsController.getSkillById);

/**
 * @route   POST /api/skills
 * @desc    Create new skill
 * @access  Private (Admin)
 */
router.post('/', authMiddleware.protect, authMiddleware.restrictTo('admin'), skillsController.createSkill);

/**
 * @route   PUT /api/skills/:id
 * @desc    Update skill
 * @access  Private (Admin)
 */
router.put('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), skillsController.updateSkill);

/**
 * @route   DELETE /api/skills/:id
 * @desc    Delete skill
 * @access  Private (Admin)
 */
router.delete('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), skillsController.deleteSkill);

/**
 * @route   POST /api/skills/:id/endorsements
 * @desc    Add endorsement to skill
 * @access  Private (Authenticated users)
 */
router.post('/:id/endorsements', authMiddleware.protect, skillsController.addEndorsement);

/**
 * @route   GET /api/skills/:id/endorsements
 * @desc    Get endorsements for a skill
 * @access  Public
 */
router.get('/:id/endorsements', skillsController.getEndorsements);

/**
 * @route   PATCH /api/skills/endorsements/:endorsementId/status
 * @desc    Update endorsement status
 * @access  Private (Admin)
 */
router.patch('/endorsements/:endorsementId/status', authMiddleware.protect, authMiddleware.restrictTo('admin'), skillsController.updateEndorsementStatus);

export default router;