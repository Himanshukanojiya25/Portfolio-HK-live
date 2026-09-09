import { Request, Response } from 'express';
import Testimonial, { ITestimonial } from '../models/testimonial.model.js';

export const testimonialController = {
  // Get all approved testimonials (public)
  getApprovedTestimonials: async (req: Request, res: Response) => {
    try {
      const { featured, limit } = req.query;
      
      const filter: any = { isApproved: true };
      
      if (featured === 'true') {
        filter.featured = true;
      }

      const testimonials = await Testimonial.find(filter)
        .sort({ createdAt: -1 })
        .limit(Number(limit) || 10);

      res.status(200).json({
        success: true,
        count: testimonials.length,
        data: testimonials
      });

    } catch (error) {
      console.error('Get testimonials error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch testimonials'
      });
    }
  },

  // Get ALL testimonials including unapproved (admin only)
  getAllTestimonials: async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 20, approved, featured } = req.query;
      
      const filter: any = {};
      
      if (approved === 'true') filter.isApproved = true;
      if (approved === 'false') filter.isApproved = false;
      if (featured === 'true') filter.featured = true;
      if (featured === 'false') filter.featured = false;

      const testimonials = await Testimonial.find(filter)
        .sort({ createdAt: -1 })
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit));

      const total = await Testimonial.countDocuments(filter);

      res.status(200).json({
        success: true,
        count: testimonials.length,
        total,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        },
        data: testimonials
      });

    } catch (error) {
      console.error('Get all testimonials error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch testimonials'
      });
    }
  },

  // Get testimonial by ID (public)
  getTestimonialById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const testimonial = await Testimonial.findById(id);
      
      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      // Only return if approved or user is admin
      if (!testimonial.isApproved) {
        return res.status(403).json({
          success: false,
          message: 'Testimonial not approved yet'
        });
      }

      res.status(200).json({
        success: true,
        data: testimonial
      });

    } catch (error) {
      console.error('Get testimonial error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch testimonial'
      });
    }
  },

  // Create new testimonial (admin only)
  createTestimonial: async (req: Request, res: Response) => {
    try {
      const { name, role, company, avatar, content, rating, isApproved, featured } = req.body;

      // Validation
      if (!name || !role || !company || !content) {
        return res.status(400).json({
          success: false,
          message: 'Name, role, company and content are required'
        });
      }

      if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      const testimonial = await Testimonial.create({
        name,
        role,
        company,
        avatar: avatar || '',
        content,
        rating: rating || 5,
        isApproved: isApproved || false,
        featured: featured || false
      });

      res.status(201).json({
        success: true,
        message: 'Testimonial created successfully',
        data: testimonial
      });

    } catch (error: any) {
      console.error('Create testimonial error:', error);
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err: any) => err.message);
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to create testimonial'
      });
    }
  },

  // Update testimonial (admin only)
  updateTestimonial: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Validate rating if provided
      if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      const testimonial = await Testimonial.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Testimonial updated successfully',
        data: testimonial
      });

    } catch (error: any) {
      console.error('Update testimonial error:', error);
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err: any) => err.message);
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update testimonial'
      });
    }
  },

  // Delete testimonial (admin only)
  deleteTestimonial: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const testimonial = await Testimonial.findByIdAndDelete(id);

      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Testimonial deleted successfully'
      });

    } catch (error) {
      console.error('Delete testimonial error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete testimonial'
      });
    }
  },

  // Approve testimonial (admin only)
  approveTestimonial: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const testimonial = await Testimonial.findByIdAndUpdate(
        id,
        { isApproved: true },
        { new: true }
      );

      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Testimonial approved successfully',
        data: testimonial
      });

    } catch (error) {
      console.error('Approve testimonial error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to approve testimonial'
      });
    }
  },

  // Feature testimonial (admin only)
  featureTestimonial: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { featured } = req.body;

      const testimonial = await Testimonial.findByIdAndUpdate(
        id,
        { featured: featured === true || featured === 'true' },
        { new: true }
      );

      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      res.status(200).json({
        success: true,
        message: `Testimonial ${testimonial.featured ? 'featured' : 'unfeatured'} successfully`,
        data: testimonial
      });

    } catch (error) {
      console.error('Feature testimonial error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update testimonial feature status'
      });
    }
  }
};

export default testimonialController;