import { Request, Response } from 'express';
import Comment from '../models/Comment.model.js';
import Blog from '../models/Blog.model.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const commentsController = {
  // Get comments for a blog
  getComments: async (req: Request, res: Response) => {
    try {
      const { blogId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      // Check if blog exists and is published
      const blog = await Blog.findOne({
        _id: blogId,
        status: 'published',
        isPublic: true
      });

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }

      const comments = await Comment.find({
        blog: blogId,
        status: 'approved',
        parentComment: { $exists: false } // Only top-level comments
      })
      .populate('replies')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

      const total = await Comment.countDocuments({
        blog: blogId,
        status: 'approved',
        parentComment: { $exists: false }
      });

      res.status(200).json({
        success: true,
        data: comments,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });

    } catch (error) {
      console.error('Get comments error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch comments'
      });
    }
  },

  // Create new comment
  createComment: async (req: Request, res: Response) => {
    try {
      const { blogId } = req.params;
      const { content, author, parentComment } = req.body;

      // Check if blog exists and allows comments
      const blog = await Blog.findOne({
        _id: blogId,
        status: 'published',
        isPublic: true,
        allowComments: true
      });

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found or comments disabled'
        });
      }

      // Check if parent comment exists (for replies)
      if (parentComment) {
        const parent = await Comment.findById(parentComment);
        if (!parent) {
          return res.status(404).json({
            success: false,
            message: 'Parent comment not found'
          });
        }
      }

      // Get client info
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');

      const comment = new Comment({
        content,
        blog: blogId,
        author,
        parentComment,
        ipAddress,
        userAgent
      });

      await comment.save();

      // If it's a reply, add to parent comment's replies
      if (parentComment) {
        await Comment.findByIdAndUpdate(
          parentComment,
          { $push: { replies: comment._id } }
        );
      }

      // Increment blog comment count
      await Blog.findByIdAndUpdate(
        blogId,
        { $inc: { commentCount: 1 } }
      );

      res.status(201).json({
        success: true,
        message: 'Comment submitted successfully. It will appear after approval.',
        data: comment
      });

    } catch (error) {
      console.error('Create comment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create comment'
      });
    }
  },

  // Update comment status (admin only)
  updateCommentStatus: async (req: AuthRequest, res: Response) => {
    try {
      const { commentId } = req.params;
      const { status } = req.body;

      const comment = await Comment.findByIdAndUpdate(
        commentId,
        { status },
        { new: true }
      );

      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Comment not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Comment status updated',
        data: comment
      });

    } catch (error) {
      console.error('Update comment status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update comment status'
      });
    }
  },

  // Delete comment (admin only)
  deleteComment: async (req: AuthRequest, res: Response) => {
    try {
      const { commentId } = req.params;

      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Comment not found'
        });
      }

      // If it's a parent comment, delete all replies first
      if (comment.replies.length > 0) {
        await Comment.deleteMany({ _id: { $in: comment.replies } });
      }

      // Remove from parent comment's replies if it's a reply
      if (comment.parentComment) {
        await Comment.findByIdAndUpdate(
          comment.parentComment,
          { $pull: { replies: commentId } }
        );
      }

      // Delete the comment
      await Comment.findByIdAndDelete(commentId);

      // Decrement blog comment count
      await Blog.findByIdAndUpdate(
        comment.blog,
        { $inc: { commentCount: -1 } }
      );

      res.status(200).json({
        success: true,
        message: 'Comment deleted successfully'
      });

    } catch (error) {
      console.error('Delete comment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete comment'
      });
    }
  },

  // Like a comment
  likeComment: async (req: Request, res: Response) => {
    try {
      const { commentId } = req.params;

      const comment = await Comment.findByIdAndUpdate(
        commentId,
        { $inc: { likeCount: 1 } },
        { new: true }
      );

      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Comment not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Comment liked successfully',
        data: { likeCount: comment.likeCount }
      });

    } catch (error) {
      console.error('Like comment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to like comment'
      });
    }
  },

  // Get pending comments (admin only)
  getPendingComments: async (req: AuthRequest, res: Response) => {
    try {
      const { page = 1, limit = 20 } = req.query;

      const comments = await Comment.find({ status: 'pending' })
        .populate('blog', 'title slug')
        .sort({ createdAt: -1 })
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit));

      const total = await Comment.countDocuments({ status: 'pending' });

      res.status(200).json({
        success: true,
        data: comments,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });

    } catch (error) {
      console.error('Get pending comments error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch pending comments'
      });
    }
  }
};

export default commentsController;