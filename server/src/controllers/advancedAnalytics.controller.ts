import { Request, Response } from 'express';
import advancedAnalyticsService from '../services/advancedAnalytics.service.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const advancedAnalyticsController = {
  // Get comprehensive analytics report
  getComprehensiveReport: async (req: AuthRequest, res: Response) => {
    try {
      const { startDate, endDate, period = '30d' } = req.query;

      // Calculate date range based on period
      const end = endDate ? new Date(endDate as string) : new Date();
      let start = startDate ? new Date(startDate as string) : new Date();
      
      if (!startDate) {
        const days = parseInt(period as string) || 30;
        start.setDate(start.getDate() - days);
      }

      const report = await advancedAnalyticsService.getComprehensiveReport(start, end);

      res.status(200).json({
        success: true,
        data: report,
        timeframe: {
          start: start.toISOString(),
          end: end.toISOString()
        }
      });

    } catch (error) {
      console.error('Get comprehensive report error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate comprehensive report'
      });
    }
  },

  // Track custom analytics event
  trackEvent: async (req: Request, res: Response) => {
    try {
      const eventData = req.body;

      // Add client information
      const fullEventData = {
        ...eventData,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent') || 'Unknown'
      };

      const event = await advancedAnalyticsService.trackEvent(fullEventData);

      res.status(201).json({
        success: true,
        message: 'Event tracked successfully',
        data: { eventId: event._id }
      });

    } catch (error) {
      console.error('Track event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to track event'
      });
    }
  },

  // Get real-time analytics
  getRealTimeAnalytics: async (req: AuthRequest, res: Response) => {
    try {
      const { hours = '24' } = req.query;
      const hoursNumber = parseInt(hours as string);

      if (isNaN(hoursNumber) || hoursNumber < 1 || hoursNumber > 168) {
        return res.status(400).json({
          success: false,
          message: 'Hours must be between 1 and 168 (1 week)'
        });
      }

      const realTimeData = await advancedAnalyticsService.getRealTimeAnalytics(hoursNumber);

      res.status(200).json({
        success: true,
        data: realTimeData
      });

    } catch (error) {
      console.error('Get real-time analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch real-time analytics'
      });
    }
  },

  // Generate analytics insights
  getAnalyticsInsights: async (req: AuthRequest, res: Response) => {
    try {
      const { days = '30' } = req.query;
      const daysNumber = parseInt(days as string);

      if (isNaN(daysNumber) || daysNumber < 7 || daysNumber > 365) {
        return res.status(400).json({
          success: false,
          message: 'Days must be between 7 and 365'
        });
      }

      const insights = await advancedAnalyticsService.generateInsights(daysNumber);

      res.status(200).json({
        success: true,
        data: insights
      });

    } catch (error) {
      console.error('Get analytics insights error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate insights'
      });
    }
  },

  // Generate advanced analytics for a specific period
  generatePeriodAnalytics: async (req: AuthRequest, res: Response) => {
    try {
      const { date, period = 'daily' } = req.body;

      if (!date) {
        return res.status(400).json({
          success: false,
          message: 'Date is required'
        });
      }

      if (!['daily', 'weekly', 'monthly'].includes(period)) {
        return res.status(400).json({
          success: false,
          message: 'Period must be daily, weekly, or monthly'
        });
      }

      const analyticsDate = new Date(date);
      const analytics = await advancedAnalyticsService.generateAdvancedAnalytics(analyticsDate, period as any);

      res.status(200).json({
        success: true,
        message: `Advanced analytics generated for ${period} period`,
        data: analytics
      });

    } catch (error) {
      console.error('Generate period analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate period analytics'
      });
    }
  }
};

export default advancedAnalyticsController;