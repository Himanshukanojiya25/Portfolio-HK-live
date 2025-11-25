import { Request, Response } from 'express';
import Project from '../models/Project.model.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const projectsController = {
  // Get all projects (with filtering)
  getProjects: async (req: Request, res: Response) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        category, 
        status,
        featured,
        tech,
        public: isPublic = 'true'
      } = req.query;

      const filter: any = { isPublic: isPublic === 'true' };
      
      if (category) {
        filter.category = category;
      }
      
      if (status) {
        filter.status = status;
      }
      
      if (featured === 'true') {
        filter.isFeatured = true;
      }
      
      if (tech) {
        filter.techStack = { $in: [tech] };
      }

      const projects = await Project.find(filter)
        .populate('technologies')
        .sort({ displayOrder: 1, priority: -1, createdAt: -1 })
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit))
        .select('-__v');

      const total = await Project.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: projects,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });

    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch projects'
      });
    }
  },

  // Get project by ID
  getProjectById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const project = await Project.findById(id)
        .populate('technologies');

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      // Increment view count
      project.viewCount += 1;
      await project.save();

      res.status(200).json({
        success: true,
        data: project
      });

    } catch (error) {
      console.error('Get project error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch project'
      });
    }
  },

  // Create new project (Admin only)
  createProject: async (req: AuthRequest, res: Response) => {
    try {
      const projectData = req.body;

      const project = new Project(projectData);
      await project.save();

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project
      });

    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create project'
      });
    }
  },

  // Update project (Admin only)
  updateProject: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const project = await Project.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      ).populate('technologies');

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        data: project
      });

    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update project'
      });
    }
  },

  // Delete project (Admin only)
  deleteProject: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const project = await Project.findByIdAndDelete(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Project deleted successfully'
      });

    } catch (error) {
      console.error('Delete project error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete project'
      });
    }
  },

  // Like a project
  likeProject: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const project = await Project.findByIdAndUpdate(
        id,
        { $inc: { likeCount: 1 } },
        { new: true }
      );

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Project liked successfully',
        data: { likeCount: project.likeCount }
      });

    } catch (error) {
      console.error('Like project error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to like project'
      });
    }
  },

  // Increment download count
  incrementDownloadCount: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const project = await Project.findByIdAndUpdate(
        id,
        { $inc: { downloadCount: 1 } },
        { new: true }
      );

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Download count updated',
        data: { downloadCount: project.downloadCount }
      });

    } catch (error) {
      console.error('Increment download count error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update download count'
      });
    }
  },

  // Get featured projects
  getFeaturedProjects: async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({
        isFeatured: true,
        isPublic: true
      })
      .populate('technologies')
      .sort({ displayOrder: 1, priority: -1 })
      .limit(6);

      res.status(200).json({
        success: true,
        data: projects
      });

    } catch (error) {
      console.error('Get featured projects error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch featured projects'
      });
    }
  },

  // Get projects by technology
  getProjectsByTech: async (req: Request, res: Response) => {
    try {
      const { tech } = req.params;

      const projects = await Project.find({
        techStack: { $in: [tech] },
        isPublic: true
      })
      .populate('technologies')
      .sort({ priority: -1, createdAt: -1 });

      res.status(200).json({
        success: true,
        data: projects
      });

    } catch (error) {
      console.error('Get projects by tech error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch projects by technology'
      });
    }
  }
};

export default projectsController;