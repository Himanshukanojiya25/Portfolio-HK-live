import { Request, Response } from 'express';
import Resume from '../models/Resume.model.js';
import Experience from '../models/Experience.model.js';
import Education from '../models/Education.model.js';
import Skill from '../models/Skill.model.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const resumeController = {
  // Get main resume (public)
  getResume: async (req: Request, res: Response) => {
    try {
      const resume = await Resume.findOne({ isActive: true, isPublic: true })
        .populate('experiences')
        .populate('educations')
        .populate('skills')
        .populate('projects');

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }

      // Increment view count
      resume.viewCount += 1;
      await resume.save();

      res.status(200).json({
        success: true,
        data: resume
      });

    } catch (error) {
      console.error('Get resume error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch resume'
      });
    }
  },

  // Get resume for admin (with private data)
  getAdminResume: async (req: AuthRequest, res: Response) => {
    try {
      const resume = await Resume.findOne({ isActive: true })
        .populate('experiences')
        .populate('educations')
        .populate('skills')
        .populate('projects');

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }

      res.status(200).json({
        success: true,
        data: resume
      });

    } catch (error) {
      console.error('Get admin resume error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch admin resume'
      });
    }
  },

  // Update resume
  updateResume: async (req: AuthRequest, res: Response) => {
    try {
      const updates = req.body;
      
      const resume = await Resume.findOneAndUpdate(
        { isActive: true },
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Resume updated successfully',
        data: resume
      });

    } catch (error) {
      console.error('Update resume error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update resume'
      });
    }
  },

  // Add experience to resume
  addExperience: async (req: AuthRequest, res: Response) => {
    try {
      const experienceData = req.body;
      
      // Create new experience
      const experience = new Experience(experienceData);
      await experience.save();

      // Add to resume
      const resume = await Resume.findOneAndUpdate(
        { isActive: true },
        { $push: { experiences: experience._id } },
        { new: true }
      ).populate('experiences');

      res.status(201).json({
        success: true,
        message: 'Experience added successfully',
        data: {
          experience,
          resume
        }
      });

    } catch (error) {
      console.error('Add experience error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add experience'
      });
    }
  },

  // Add education to resume
  addEducation: async (req: AuthRequest, res: Response) => {
    try {
      const educationData = req.body;
      
      const education = new Education(educationData);
      await education.save();

      const resume = await Resume.findOneAndUpdate(
        { isActive: true },
        { $push: { educations: education._id } },
        { new: true }
      ).populate('educations');

      res.status(201).json({
        success: true,
        message: 'Education added successfully',
        data: {
          education,
          resume
        }
      });

    } catch (error) {
      console.error('Add education error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add education'
      });
    }
  },

  // Update experience
  updateExperience: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const experience = await Experience.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Experience not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Experience updated successfully',
        data: experience
      });

    } catch (error) {
      console.error('Update experience error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update experience'
      });
    }
  },

  // Update education
  updateEducation: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const education = await Education.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!education) {
        return res.status(404).json({
          success: false,
          message: 'Education not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Education updated successfully',
        data: education
      });

    } catch (error) {
      console.error('Update education error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update education'
      });
    }
  },

  // Delete experience
  deleteExperience: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      // Remove from resume first
      await Resume.findOneAndUpdate(
        { isActive: true },
        { $pull: { experiences: id } }
      );

      // Then delete experience
      const experience = await Experience.findByIdAndDelete(id);

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Experience not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Experience deleted successfully'
      });

    } catch (error) {
      console.error('Delete experience error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete experience'
      });
    }
  },

  // Delete education
  deleteEducation: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      await Resume.findOneAndUpdate(
        { isActive: true },
        { $pull: { educations: id } }
      );

      const education = await Education.findByIdAndDelete(id);

      if (!education) {
        return res.status(404).json({
          success: false,
          message: 'Education not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Education deleted successfully'
      });

    } catch (error) {
      console.error('Delete education error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete education'
      });
    }
  },

  // Increment download count
  incrementDownloadCount: async (req: Request, res: Response) => {
    try {
      const resume = await Resume.findOneAndUpdate(
        { isActive: true },
        { $inc: { downloadCount: 1 } },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Download count updated',
        data: { downloadCount: resume?.downloadCount }
      });

    } catch (error) {
      console.error('Increment download count error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update download count'
      });
    }
  }
};

export default resumeController;