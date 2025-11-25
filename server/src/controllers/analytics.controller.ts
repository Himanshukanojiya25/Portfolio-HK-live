import { Request, Response } from 'express';
import analyticsService from '../services/analytics.service.js';
import { AnalyticsRequest } from '../middleware/analytics.middleware.js';

export const analyticsController = {
  // Update engagement data from frontend
  updateEngagement: async (req: Request, res: Response) => {
    try {
      const { sessionId, timeOnPage, scrollDepth, url } = req.body;

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID is required'
        });
      }

      const success = await analyticsService.updateEngagement(
        sessionId,
        timeOnPage || 0,
        scrollDepth || 0
      );

      res.status(200).json({
        success: true,
        message: 'Engagement data updated successfully'
      });

    } catch (error) {
      console.error('Update engagement error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update engagement data'
      });
    }
  },

  // Get dashboard analytics (Admin only)
  getDashboardAnalytics: async (req: Request, res: Response) => {
    try {
      const { days = '30' } = req.query;
      const daysNumber = parseInt(days as string);

      if (isNaN(daysNumber) || daysNumber < 1 || daysNumber > 365) {
        return res.status(400).json({
          success: false,
          message: 'Days must be a number between 1 and 365'
        });
      }

      const analytics = await analyticsService.getDashboardAnalytics(daysNumber);

      res.status(200).json({
        success: true,
        data: analytics
      });

    } catch (error) {
      console.error('Get dashboard analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard analytics'
      });
    }
  },

  // Get daily analytics for charts
  getDailyAnalytics: async (req: Request, res: Response) => {
    try {
      const { days = '30' } = req.query;
      const daysNumber = parseInt(days as string);

      if (isNaN(daysNumber) || daysNumber < 1 || daysNumber > 365) {
        return res.status(400).json({
          success: false,
          message: 'Days must be a number between 1 and 365'
        });
      }

      const dailyData = await analyticsService.getDailyAnalytics(daysNumber);

      res.status(200).json({
        success: true,
        data: dailyData
      });

    } catch (error) {
      console.error('Get daily analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch daily analytics'
      });
    }
  },

  // Get visitor statistics
  getVisitorStats: async (req: Request, res: Response) => {
    try {
      const stats = await analyticsService.getVisitorStats();

      res.status(200).json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Get visitor stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch visitor statistics'
      });
    }
  },

  // Clean up old data (Admin only)
  cleanupData: async (req: Request, res: Response) => {
    try {
      const { retentionDays = '30' } = req.query;
      const retentionDaysNumber = parseInt(retentionDays as string);

      if (isNaN(retentionDaysNumber) || retentionDaysNumber < 1) {
        return res.status(400).json({
          success: false,
          message: 'Retention days must be a positive number'
        });
      }

      const deletedCount = await analyticsService.cleanupOldData(retentionDaysNumber);

      res.status(200).json({
        success: true,
        message: `Cleaned up ${deletedCount} old records`,
        data: { deletedCount }
      });

    } catch (error) {
      console.error('Cleanup data error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cleanup old data'
      });
    }
  }
};

export default analyticsController;