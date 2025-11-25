import { Request, Response } from 'express';
import Skill from '../models/Skill.model.js';
import Endorsement from '../models/Endorsement.model.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const skillsController = {
  // Get all skills (public)
  getSkills: async (req: Request, res: Response) => {
    try {
      const { category, featured, active = 'true' } = req.query;
      
      const filter: any = { isActive: active === 'true' };
      
      if (category) {
        filter.category = category;
      }
      
      if (featured === 'true') {
        filter.isFeatured = true;
      }

      const skills = await Skill.find(filter)
        .populate('endorsements')
        .sort({ displayOrder: 1, endorsementCount: -1 });

      res.status(200).json({
        success: true,
        data: skills
      });

    } catch (error) {
      console.error('Get skills error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch skills'
      });
    }
  },

  // Get skill by ID
  getSkillById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const skill = await Skill.findById(id)
        .populate({
          path: 'endorsements',
          match: { status: 'approved', isPublic: true },
          populate: {
            path: 'endorsedBy',
            select: 'name email'
          }
        });

      if (!skill) {
        return res.status(404).json({
          success: false,
          message: 'Skill not found'
        });
      }

      res.status(200).json({
        success: true,
        data: skill
      });

    } catch (error) {
      console.error('Get skill error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch skill'
      });
    }
  },

  // Create new skill (Admin only)
  createSkill: async (req: AuthRequest, res: Response) => {
    try {
      const skillData = req.body;

      // Check if skill already exists
      const existingSkill = await Skill.findOne({ 
        name: { $regex: new RegExp(`^${skillData.name}$`, 'i') } 
      });

      if (existingSkill) {
        return res.status(400).json({
          success: false,
          message: 'Skill with this name already exists'
        });
      }

      const skill = new Skill(skillData);
      await skill.save();

      res.status(201).json({
        success: true,
        message: 'Skill created successfully',
        data: skill
      });

    } catch (error) {
      console.error('Create skill error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create skill'
      });
    }
  },

  // Update skill (Admin only)
  updateSkill: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const skill = await Skill.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!skill) {
        return res.status(404).json({
          success: false,
          message: 'Skill not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Skill updated successfully',
        data: skill
      });

    } catch (error) {
      console.error('Update skill error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update skill'
      });
    }
  },

  // Delete skill (Admin only)
  deleteSkill: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const skill = await Skill.findByIdAndDelete(id);

      if (!skill) {
        return res.status(404).json({
          success: false,
          message: 'Skill not found'
        });
      }

      // Also delete associated endorsements
      await Endorsement.deleteMany({ skill: id });

      res.status(200).json({
        success: true,
        message: 'Skill deleted successfully'
      });

    } catch (error) {
      console.error('Delete skill error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete skill'
      });
    }
  },

  // Add endorsement to skill
  addEndorsement: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const endorsementData = req.body;

      // Check if skill exists
      const skill = await Skill.findById(id);
      if (!skill) {
        return res.status(404).json({
          success: false,
          message: 'Skill not found'
        });
      }

      // Check if user already endorsed this skill
      const existingEndorsement = await Endorsement.findOne({
        skill: id,
        endorsedBy: req.user._id
      });

      if (existingEndorsement) {
        return res.status(400).json({
          success: false,
          message: 'You have already endorsed this skill'
        });
      }

      // Create endorsement
      const endorsement = new Endorsement({
        ...endorsementData,
        skill: id,
        endorsedBy: req.user._id,
        endorserName: req.user.name,
        endorserEmail: req.user.email
      });

      await endorsement.save();

      // Add endorsement to skill
      skill.endorsements.push(endorsement._id);
      skill.endorsementCount = skill.endorsements.length;
      await skill.save();

      res.status(201).json({
        success: true,
        message: 'Skill endorsed successfully',
        data: {
          endorsement,
          skill
        }
      });

    } catch (error) {
      console.error('Add endorsement error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add endorsement'
      });
    }
  },

  // Get endorsements for a skill
  getEndorsements: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status = 'approved' } = req.query;

      const endorsements = await Endorsement.find({
        skill: id,
        status: status as string,
        isPublic: true
      })
      .populate('endorsedBy', 'name email')
      .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: endorsements
      });

    } catch (error) {
      console.error('Get endorsements error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch endorsements'
      });
    }
  },

  // Update endorsement status (Admin only)
  updateEndorsementStatus: async (req: AuthRequest, res: Response) => {
    try {
      const { endorsementId } = req.params;
      const { status } = req.body;

      const endorsement = await Endorsement.findByIdAndUpdate(
        endorsementId,
        { status },
        { new: true }
      );

      if (!endorsement) {
        return res.status(404).json({
          success: false,
          message: 'Endorsement not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Endorsement status updated',
        data: endorsement
      });

    } catch (error) {
      console.error('Update endorsement status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update endorsement status'
      });
    }
  }
};

export default skillsController;