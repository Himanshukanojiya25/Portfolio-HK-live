import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';
import { AnalyticsEvent } from '../models/AnalyticsEvent.model.js';

export const analyticsController = {
  // Get analytics summary
  getSummary: async (req: Request, res: Response) => {
    try {
      const filters = {
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        country: req.query.country as string,
        deviceType: req.query.deviceType as string,
        pageUrl: req.query.pageUrl as string
      };

      const summary = await AnalyticsService.getSummary(filters);
      
      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Get analytics summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics summary'
      });
    }
  },

  // Get time series data
  getTimeSeries: async (req: Request, res: Response) => {
    try {
      const filters = {
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined
      };

      // Default to last 30 days if no dates provided
      if (!filters.startDate) {
        filters.startDate = new Date();
        filters.startDate.setDate(filters.startDate.getDate() - 30);
      }

      const timeSeries = await AnalyticsService.getTimeSeries(filters);
      
      res.status(200).json({
        success: true,
        data: timeSeries
      });
    } catch (error) {
      console.error('Get time series error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch time series data'
      });
    }
  },

  // Get top pages
  getTopPages: async (req: Request, res: Response) => {
    try {
      const filters = {
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10
      };

      const topPages = await AnalyticsService.getTopPages(filters);
      
      res.status(200).json({
        success: true,
        data: topPages
      });
    } catch (error) {
      console.error('Get top pages error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch top pages'
      });
    }
  },

  // Get device breakdown
  getDeviceBreakdown: async (req: Request, res: Response) => {
    try {
      const filters = {
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined
      };

      const deviceBreakdown = await AnalyticsService.getDeviceBreakdown(filters);
      
      res.status(200).json({
        success: true,
        data: deviceBreakdown
      });
    } catch (error) {
      console.error('Get device breakdown error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch device breakdown'
      });
    }
  },

  // Get location data
  getLocationData: async (req: Request, res: Response) => {
    try {
      const filters = {
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 15
      };

      const locationData = await AnalyticsService.getLocationData(filters);
      
      res.status(200).json({
        success: true,
        data: locationData
      });
    } catch (error) {
      console.error('Get location data error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch location data'
      });
    }
  },

  // Get real-time visitors
  getRealTimeVisitors: async (req: Request, res: Response) => {
    try {
      const realTimeVisitors = await AnalyticsService.getRealTimeVisitors();
      
      res.status(200).json({
        success: true,
        data: realTimeVisitors
      });
    } catch (error) {
      console.error('Get real-time visitors error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch real-time visitors'
      });
    }
  },

  // Get visitor details
  getVisitorDetails: async (req: Request, res: Response) => {
    try {
      const { visitorId } = req.params;
      
      if (!visitorId) {
        return res.status(400).json({
          success: false,
          message: 'Visitor ID is required'
        });
      }

      const visitorDetails = await AnalyticsService.getVisitorDetails(visitorId);
      
      if (!visitorDetails) {
        return res.status(404).json({
          success: false,
          message: 'Visitor not found'
        });
      }

      res.status(200).json({
        success: true,
        data: visitorDetails
      });
    } catch (error) {
      console.error('Get visitor details error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch visitor details'
      });
    }
  },

  // Get visitor journey
  getVisitorJourney: async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID is required'
        });
      }

      const journey = await AnalyticsService.getVisitorJourney(sessionId);
      
      res.status(200).json({
        success: true,
        data: journey
      });
    } catch (error) {
      console.error('Get visitor journey error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch visitor journey'
      });
    }
  },

  // Track custom event (from frontend)
  trackEvent: async (req: Request, res: Response) => {
    try {
      const eventData = {
        ...req.body,
        ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Unknown'
      };

      const event = await AnalyticsService.trackEvent(eventData);
      
      res.status(201).json({
        success: true,
        data: event
      });
    } catch (error) {
      console.error('Track event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to track event'
      });
    }
  },

  // Export analytics data
  exportData: async (req: Request, res: Response) => {
    try {
      const filters = {
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined
      };

      const data = await AnalyticsEvent.find({
        timestamp: {
          $gte: filters.startDate || new Date(0),
          $lte: filters.endDate || new Date()
        }
      })
      .select('-__v -_id')
      .sort({ timestamp: -1 })
      .lean();

      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics-export.csv');
      
      // Convert to CSV
      if (data.length > 0) {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => 
          Object.values(row).map(value => 
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
          ).join(',')
        );
        
        const csv = [headers, ...rows].join('\n');
        res.send(csv);
      } else {
        res.send('No data available for export');
      }
    } catch (error) {
      console.error('Export data error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export data'
      });
    }
  }
};

export default analyticsController;