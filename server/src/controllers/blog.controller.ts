import { Request, Response } from 'express';
import Blog from '../models/Blog.model.js';
import Comment from '../models/Comment.model.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const blogController = {
  // Get all published blogs (public)
  getBlogs: async (req: Request, res: Response) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        category, 
        tag,
        featured,
        search 
      } = req.query;

      const filter: any = { 
        status: 'published',
        isPublic: true 
      };
      
      if (category) {
        filter.category = category;
      }
      
      if (tag) {
        filter.tags = { $in: [tag] };
      }
      
      if (featured === 'true') {
        filter.isFeatured = true;
      }
      
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search as string, 'i')] } }
        ];
      }

      const blogs = await Blog.find(filter)
        .populate('author', 'name email')
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit))
        .select('-content'); // Don't send full content in list

      const total = await Blog.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: blogs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });

    } catch (error) {
      console.error('Get blogs error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch blogs'
      });
    }
  },

  // Get blog by slug
  getBlogBySlug: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      const blog = await Blog.findOne({ 
        slug, 
        status: 'published',
        isPublic: true 
      }).populate('author', 'name email');

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }

      // Increment view count
      blog.viewCount += 1;
      await blog.save();

      res.status(200).json({
        success: true,
        data: blog
      });

    } catch (error) {
      console.error('Get blog error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch blog post'
      });
    }
  },

  // Get blog by ID (admin - includes drafts)
  getBlogById: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const blog = await Blog.findById(id)
        .populate('author', 'name email');

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }

      res.status(200).json({
        success: true,
        data: blog
      });

    } catch (error) {
      console.error('Get blog by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch blog post'
      });
    }
  },

  // Create new blog (admin only)
  createBlog: async (req: AuthRequest, res: Response) => {
    try {
      const blogData = req.body;

      // Calculate word count and reading time
      const wordCount = blogData.content.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);

      const blog = new Blog({
        ...blogData,
        author: req.user._id,
        authorName: req.user.name,
        wordCount,
        readingTime,
        // Set publishedAt if publishing
        publishedAt: blogData.status === 'published' ? new Date() : undefined
      });

      await blog.save();

      res.status(201).json({
        success: true,
        message: 'Blog post created successfully',
        data: blog
      });

    } catch (error) {
      console.error('Create blog error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create blog post'
      });
    }
  },

  // Update blog (admin only)
  updateBlog: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Recalculate word count and reading time if content is updated
      if (updates.content) {
        const wordCount = updates.content.split(/\s+/).length;
        updates.wordCount = wordCount;
        updates.readingTime = Math.ceil(wordCount / 200);
      }

      // Set publishedAt if status changes to published
      if (updates.status === 'published') {
        const existingBlog = await Blog.findById(id);
        if (existingBlog && existingBlog.status !== 'published') {
          updates.publishedAt = new Date();
        }
      }

      const blog = await Blog.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      ).populate('author', 'name email');

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Blog post updated successfully',
        data: blog
      });

    } catch (error) {
      console.error('Update blog error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update blog post'
      });
    }
  },

  // Delete blog (admin only)
  deleteBlog: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const blog = await Blog.findByIdAndDelete(id);

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }

      // Also delete associated comments
      await Comment.deleteMany({ blog: id });

      res.status(200).json({
        success: true,
        message: 'Blog post deleted successfully'
      });

    } catch (error) {
      console.error('Delete blog error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete blog post'
      });
    }
  },

  // Like a blog
  likeBlog: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const blog = await Blog.findByIdAndUpdate(
        id,
        { $inc: { likeCount: 1 } },
        { new: true }
      );

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Blog post liked successfully',
        data: { likeCount: blog.likeCount }
      });

    } catch (error) {
      console.error('Like blog error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to like blog post'
      });
    }
  },

  // Get featured blogs
  getFeaturedBlogs: async (req: Request, res: Response) => {
    try {
      const blogs = await Blog.find({
        isFeatured: true,
        status: 'published',
        isPublic: true
      })
      .populate('author', 'name email')
      .sort({ publishedAt: -1 })
      .limit(6)
      .select('-content');

      res.status(200).json({
        success: true,
        data: blogs
      });

    } catch (error) {
      console.error('Get featured blogs error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch featured blogs'
      });
    }
  },

  // Get blogs by category
  getBlogsByCategory: async (req: Request, res: Response) => {
    try {
      const { category } = req.params;

      const blogs = await Blog.find({
        category,
        status: 'published',
        isPublic: true
      })
      .populate('author', 'name email')
      .sort({ publishedAt: -1 })
      .select('-content');

      res.status(200).json({
        success: true,
        data: blogs
      });

    } catch (error) {
      console.error('Get blogs by category error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch blogs by category'
      });
    }
  }
};

export default blogController;