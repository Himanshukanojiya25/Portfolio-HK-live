import { Request, Response } from 'express';
import Blog from '../models/Blog.model.js';
import Project from '../models/Project.model.js';
import Contact from '../models/Contact.model.js';
import Visitor from '../models/Visitor.model.js';
import Skill from '../models/Skill.model.js';
import Comment from '../models/Comment.model.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const adminController = {
  // Get dashboard overview statistics
  getDashboardStats: async (req: AuthRequest, res: Response) => {
    try {
      // Get current date and dates for calculations
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Parallel data fetching for better performance
      const [
        totalBlogs,
        publishedBlogs,
        totalProjects,
        publishedProjects,
        totalContacts,
        pendingContacts,
        totalSkills,
        featuredSkills,
        totalComments,
        pendingComments,
        todayVisitors,
        weekVisitors,
        monthVisitors,
        totalVisitors
      ] = await Promise.all([
        // Blog statistics
        Blog.countDocuments(),
        Blog.countDocuments({ status: 'published' }),
        
        // Project statistics
        Project.countDocuments(),
        Project.countDocuments({ isPublic: true }),
        
        // Contact statistics
        Contact.countDocuments(),
        Contact.countDocuments({ status: 'pending' }),
        
        // Skill statistics
        Skill.countDocuments({ isActive: true }),
        Skill.countDocuments({ isFeatured: true, isActive: true }),
        
        // Comment statistics
        Comment.countDocuments(),
        Comment.countDocuments({ status: 'pending' }),
        
        // Visitor statistics
        Visitor.countDocuments({ visitTime: { $gte: today } }),
        Visitor.countDocuments({ visitTime: { $gte: weekAgo } }),
        Visitor.countDocuments({ visitTime: { $gte: monthAgo } }),
        Visitor.countDocuments()
      ]);

      // Recent activities
      const recentActivities = await Promise.all([
        Blog.find().sort({ createdAt: -1 }).limit(5).select('title status createdAt'),
        Project.find().sort({ createdAt: -1 }).limit(5).select('title status createdAt'),
        Contact.find().sort({ createdAt: -1 }).limit(5).select('name email status createdAt'),
        Comment.find().sort({ createdAt: -1 }).limit(5).select('content status createdAt author.name')
      ]);

      const stats = {
        overview: {
          totalBlogs,
          publishedBlogs,
          draftBlogs: totalBlogs - publishedBlogs,
          totalProjects,
          publishedProjects,
          totalContacts,
          pendingContacts,
          totalSkills,
          featuredSkills,
          totalComments,
          pendingComments
        },
        analytics: {
          todayVisitors,
          weekVisitors,
          monthVisitors,
          totalVisitors
        },
        recentActivities: {
          blogs: recentActivities[0],
          projects: recentActivities[1],
          contacts: recentActivities[2],
          comments: recentActivities[3]
        }
      };

      res.status(200).json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard statistics'
      });
    }
  },

  // Get analytics data for charts
  getAnalyticsData: async (req: AuthRequest, res: Response) => {
    try {
      const { period = '7d' } = req.query; // 7d, 30d, 90d

      let days = 7;
      if (period === '30d') days = 30;
      if (period === '90d') days = 90;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

      // Get visitor data for the period
      const visitorData = await Visitor.aggregate([
        {
          $match: {
            visitTime: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$visitTime'
              }
            },
            visits: { $sum: 1 },
            uniqueVisitors: { $addToSet: '$visitorId' }
          }
        },
        {
          $project: {
            date: '$_id',
            visits: 1,
            uniqueVisitors: { $size: '$uniqueVisitors' }
          }
        },
        {
          $sort: { date: 1 }
        }
      ]);

      // Get blog views data
      const blogViewsData = await Blog.aggregate([
        {
          $match: {
            publishedAt: { $gte: startDate },
            status: 'published'
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$publishedAt'
              }
            },
            blogsPublished: { $sum: 1 },
            totalViews: { $sum: '$viewCount' }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      // Get device breakdown
      const deviceBreakdown = await Visitor.aggregate([
        {
          $match: {
            visitTime: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$deviceType',
            count: { $sum: 1 }
          }
        }
      ]);

      // Get country breakdown
      const countryBreakdown = await Visitor.aggregate([
        {
          $match: {
            visitTime: { $gte: startDate },
            country: { $exists: true, $ne: null }
          }
        },
        {
          $group: {
            _id: '$country',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10
        }
      ]);

      res.status(200).json({
        success: true,
        data: {
          visitorData,
          blogViewsData,
          deviceBreakdown,
          countryBreakdown
        }
      });

    } catch (error) {
      console.error('Get analytics data error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics data'
      });
    }
  },

  // Get content management overview
  getContentOverview: async (req: AuthRequest, res: Response) => {
    try {
      const [
        blogStats,
        projectStats,
        skillStats,
        commentStats
      ] = await Promise.all([
        // Blog statistics by category and status
        Blog.aggregate([
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 },
              published: {
                $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
              },
              totalViews: { $sum: '$viewCount' },
              totalLikes: { $sum: '$likeCount' }
            }
          }
        ]),

        // Project statistics by category and status
        Project.aggregate([
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 },
              published: {
                $sum: { $cond: [{ $eq: ['$isPublic', true] }, 1, 0] }
              },
              featured: {
                $sum: { $cond: ['$isFeatured', 1, 0] }
              }
            }
          }
        ]),

        // Skill statistics by category
        Skill.aggregate([
          {
            $match: { isActive: true }
          },
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 },
              totalEndorsements: { $sum: '$endorsementCount' },
              averageLevel: { $avg: { 
                $switch: {
                  branches: [
                    { case: { $eq: ['$level', 'beginner'] }, then: 1 },
                    { case: { $eq: ['$level', 'intermediate'] }, then: 2 },
                    { case: { $eq: ['$level', 'advanced'] }, then: 3 },
                    { case: { $eq: ['$level', 'expert'] }, then: 4 }
                  ],
                  default: 2
                }
              }}
            }
          }
        ]),

        // Comment statistics
        Comment.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ])
      ]);

      res.status(200).json({
        success: true,
        data: {
          blogs: blogStats,
          projects: projectStats,
          skills: skillStats,
          comments: commentStats
        }
      });

    } catch (error) {
      console.error('Get content overview error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch content overview'
      });
    }
  },

  // Get system health and performance metrics
  getSystemMetrics: async (req: AuthRequest, res: Response) => {
    try {
      // @ts-ignore - Ignore TypeScript errors for database commands
      const dbStats = await Blog.db.db.command({ dbStats: 1 });
      
      const collections = ['blogs', 'projects', 'contacts', 'visitors', 'skills', 'comments'];
      const collectionStats = await Promise.all(
        collections.map(async (collection) => {
          try {
            // @ts-ignore
            const count = await Blog.db.collection(collection).countDocuments();
            // @ts-ignore
            const size = await Blog.db.collection(collection).stats();
            return {
              name: collection,
              count,
              size: size.size,
              storageSize: size.storageSize
            };
          } catch (error) {
            return {
              name: collection,
              count: 0,
              size: 0,
              storageSize: 0
            };
          }
        })
      );

      // Get recent errors or issues (you can implement error logging)
      const systemInfo = {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        database: {
          name: dbStats.db,
          collections: dbStats.collections,
          objects: dbStats.objects,
          dataSize: dbStats.dataSize,
          storageSize: dbStats.storageSize
        },
        collectionStats
      };

      res.status(200).json({
        success: true,
        data: systemInfo
      });

    } catch (error) {
      console.error('Get system metrics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch system metrics'
      });
    }
  },

  // ✅ GET QUICK ACTIONS - PROPERLY ADDED AS SEPARATE METHOD
  getQuickActions: async (req: AuthRequest, res: Response) => {
    try {
      const [recentProjects, recentContacts, popularSkills] = await Promise.all([
        Project.find().sort({ createdAt: -1 }).limit(3).select('title status createdAt'),
        Contact.find().sort({ createdAt: -1 }).limit(3).select('name email status createdAt'),
        Skill.find({ isActive: true }).sort({ endorsementCount: -1 }).limit(5).select('name category endorsementCount')
      ]);

      res.status(200).json({
        success: true,
        data: {
          recentProjects,
          recentContacts,
          popularSkills
        }
      });

    } catch (error) {
      console.error('Get quick actions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch quick actions data'
      });
    }
  }
};

export default adminController;