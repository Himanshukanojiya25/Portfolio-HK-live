import { AnalyticsEvent } from '../models/AnalyticsEvent.model.js';
import { Visitor } from '../models/Visitor.model.js';
import { GeoLocationService } from '../utils/geoLocation.utils.js';

export interface AnalyticsFilters {
  startDate?: Date;
  endDate?: Date;
  country?: string;
  deviceType?: string;
  eventType?: string;
  pageUrl?: string;
  limit?: number;
}

export interface TimeSeriesData {
  date: string;
  visitors: number;
  pageViews: number;
  sessions: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

export interface AnalyticsSummary {
  totalVisitors: number;
  totalPageViews: number;
  totalSessions: number;
  avgSessionDuration: number;
  bounceRate: number;
  returningVisitors: number;
  newVisitors: number;
}

export interface TopPagesData {
  pageUrl: string;
  pageTitle: string;
  visitors: number;
  pageViews: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

export interface DeviceData {
  deviceType: string;
  count: number;
  percentage: number;
}

export interface LocationData {
  country: string;
  countryCode: string;
  visitors: number;
  pageViews: number;
}

export interface RealTimeVisitor {
  sessionId: string;
  visitorId: string;
  pageUrl: string;
  pageTitle: string;
  country: string;
  city: string;
  deviceType: string;
  browser: string;
  os: string;
  timeOnPage: number;
  activeFor: number; // seconds
  lastActive: Date;
}

export class AnalyticsService {
  // Track a new analytics event
  static async trackEvent(eventData: any) {
    try {
      // Get location data
      const location = await GeoLocationService.getLocation(eventData.ipAddress);
      
      // Create analytics event
      const event = new AnalyticsEvent({
        ...eventData,
        country: location.country,
        countryCode: location.countryCode,
        region: location.region,
        regionName: location.regionName,
        city: location.city,
        lat: location.lat,
        lon: location.lon,
        timezone: location.timezone,
        isp: location.isp,
        org: location.org,
        asn: location.as
      });
      
      await event.save();
      return event;
    } catch (error) {
      console.error('Error tracking event:', error);
      throw error;
    }
  }

  // Get analytics summary
  static async getSummary(filters: AnalyticsFilters = {}): Promise<AnalyticsSummary> {
    try {
      const matchStage: any = {};
      
      // Apply filters
      if (filters.startDate || filters.endDate) {
        matchStage.timestamp = {};
        if (filters.startDate) matchStage.timestamp.$gte = filters.startDate;
        if (filters.endDate) matchStage.timestamp.$lte = filters.endDate;
      }
      
      if (filters.country) matchStage.country = filters.country;
      if (filters.deviceType) matchStage.deviceType = filters.deviceType;
      if (filters.pageUrl) matchStage.pageUrl = { $regex: filters.pageUrl, $options: 'i' };

      // Get unique visitors
      const uniqueVisitors = await AnalyticsEvent.distinct('visitorId', matchStage);
      
      // Get total page views (page_view events)
      const pageViewMatch = { ...matchStage, eventType: 'page_view' };
      const totalPageViews = await AnalyticsEvent.countDocuments(pageViewMatch);
      
      // Get sessions (count of unique sessionIds)
      const sessions = await AnalyticsEvent.distinct('sessionId', matchStage);
      
      // Calculate average session duration
      const sessionDurations = await AnalyticsEvent.aggregate([
        { $match: { ...matchStage, eventType: 'page_view' } },
        { $group: {
          _id: '$sessionId',
          totalTime: { $sum: '$timeOnPage' }
        }},
        { $group: {
          _id: null,
          avgDuration: { $avg: '$totalTime' }
        }}
      ]);
      
      // Calculate bounce rate (sessions with only 1 page view)
      const bounceSessions = await AnalyticsEvent.aggregate([
        { $match: { ...matchStage, eventType: 'page_view' } },
        { $group: {
          _id: '$sessionId',
          pageCount: { $sum: 1 }
        }},
        { $match: { pageCount: 1 } },
        { $count: 'bouncedSessions' }
      ]);
      
      const bounceRate = sessions.length > 0 
        ? ((bounceSessions[0]?.bouncedSessions || 0) / sessions.length) * 100 
        : 0;
      
      // Get returning vs new visitors
      const visitorSessions = await AnalyticsEvent.aggregate([
        { $match: matchStage },
        { $group: {
          _id: '$visitorId',
          sessionCount: { $addToSet: '$sessionId' }
        }},
        { $project: {
          sessionCount: { $size: '$sessionCount' }
        }}
      ]);
      
      const returningVisitors = visitorSessions.filter(v => v.sessionCount > 1).length;
      const newVisitors = uniqueVisitors.length - returningVisitors;

      return {
        totalVisitors: uniqueVisitors.length,
        totalPageViews,
        totalSessions: sessions.length,
        avgSessionDuration: sessionDurations[0]?.avgDuration || 0,
        bounceRate,
        returningVisitors,
        newVisitors
      };
    } catch (error) {
      console.error('Error getting analytics summary:', error);
      throw error;
    }
  }

  // Get time series data
  static async getTimeSeries(filters: AnalyticsFilters = {}): Promise<TimeSeriesData[]> {
    try {
      const matchStage: any = {};
      
      if (filters.startDate) matchStage.timestamp = { $gte: filters.startDate };
      if (filters.endDate) {
        matchStage.timestamp = matchStage.timestamp || {};
        matchStage.timestamp.$lte = filters.endDate;
      }
      
      const data = await AnalyticsEvent.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
            },
            visitors: { $addToSet: '$visitorId' },
            pageViews: { 
              $sum: { $cond: [{ $eq: ['$eventType', 'page_view'] }, 1, 0] }
            },
            sessions: { $addToSet: '$sessionId' },
            timeOnPage: {
              $sum: { $cond: [{ $eq: ['$eventType', 'page_view'] }, '$timeOnPage', 0] }
            },
            bounceEvents: {
              $sum: { $cond: [{ $eq: ['$eventType', 'page_view'] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            date: '$_id',
            visitors: { $size: '$visitors' },
            pageViews: 1,
            sessions: { $size: '$sessions' },
            avgTimeOnPage: {
              $cond: [
                { $gt: ['$pageViews', 0] },
                { $divide: ['$timeOnPage', '$pageViews'] },
                0
              ]
            },
            bounceRate: {
              $multiply: [
                { $divide: [1, '$pageViews'] },
                100
              ]
            }
          }
        },
        { $sort: { date: 1 } }
      ]);

      return data;
    } catch (error) {
      console.error('Error getting time series:', error);
      throw error;
    }
  }

  // Get top pages
  static async getTopPages(filters: AnalyticsFilters = {}): Promise<TopPagesData[]> {
    try {
      const matchStage: any = { eventType: 'page_view' };
      
      if (filters.startDate || filters.endDate) {
        matchStage.timestamp = {};
        if (filters.startDate) matchStage.timestamp.$gte = filters.startDate;
        if (filters.endDate) matchStage.timestamp.$lte = filters.endDate;
      }
      
      const data = await AnalyticsEvent.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$pageUrl',
            pageTitle: { $first: '$pageTitle' },
            visitors: { $addToSet: '$visitorId' },
            pageViews: { $sum: 1 },
            timeOnPage: { $sum: '$timeOnPage' },
            bounceEvents: { 
              $sum: { $cond: [{ $eq: ['$scrollDepth', 0] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            pageUrl: '$_id',
            pageTitle: 1,
            visitors: { $size: '$visitors' },
            pageViews: 1,
            avgTimeOnPage: {
              $cond: [
                { $gt: ['$pageViews', 0] },
                { $divide: ['$timeOnPage', '$pageViews'] },
                0
              ]
            },
            bounceRate: {
              $cond: [
                { $gt: ['$pageViews', 0] },
                { $multiply: [{ $divide: ['$bounceEvents', '$pageViews'] }, 100] },
                0
              ]
            }
          }
        },
        { $sort: { pageViews: -1 } },
        { $limit: filters.limit || 10 }
      ]);

      return data;
    } catch (error) {
      console.error('Error getting top pages:', error);
      throw error;
    }
  }

  // Get device breakdown
  static async getDeviceBreakdown(filters: AnalyticsFilters = {}): Promise<DeviceData[]> {
    try {
      const matchStage: any = {};
      
      if (filters.startDate || filters.endDate) {
        matchStage.timestamp = {};
        if (filters.startDate) matchStage.timestamp.$gte = filters.startDate;
        if (filters.endDate) matchStage.timestamp.$lte = filters.endDate;
      }
      
      const data = await AnalyticsEvent.aggregate([
        { $match: matchStage },
        { $group: {
          _id: '$deviceType',
          count: { $sum: 1 }
        }},
        { $project: {
          deviceType: '$_id',
          count: 1
        }},
        { $sort: { count: -1 } }
      ]);

      const total = data.reduce((sum, item) => sum + item.count, 0);
      
      return data.map(item => ({
        deviceType: item.deviceType || 'Unknown',
        count: item.count,
        percentage: total > 0 ? (item.count / total) * 100 : 0
      }));
    } catch (error) {
      console.error('Error getting device breakdown:', error);
      throw error;
    }
  }

  // Get location data
  static async getLocationData(filters: AnalyticsFilters = {}): Promise<LocationData[]> {
    try {
      const matchStage: any = {};
      
      if (filters.startDate || filters.endDate) {
        matchStage.timestamp = {};
        if (filters.startDate) matchStage.timestamp.$gte = filters.startDate;
        if (filters.endDate) matchStage.timestamp.$lte = filters.endDate;
      }
      
      const data = await AnalyticsEvent.aggregate([
        { $match: { ...matchStage, country: { $exists: true, $ne: null } } },
        { $group: {
          _id: '$country',
          countryCode: { $first: '$countryCode' },
          visitors: { $addToSet: '$visitorId' },
          pageViews: { $sum: 1 }
        }},
        { $project: {
          country: '$_id',
          countryCode: 1,
          visitors: { $size: '$visitors' },
          pageViews: 1
        }},
        { $sort: { pageViews: -1 } },
        { $limit: filters.limit || 15 }
      ]);

      return data;
    } catch (error) {
      console.error('Error getting location data:', error);
      throw error;
    }
  }

  // Get real-time active visitors (last 5 minutes)
  static async getRealTimeVisitors(): Promise<RealTimeVisitor[]> {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      const activeSessions = await AnalyticsEvent.aggregate([
        { $match: { 
          timestamp: { $gte: fiveMinutesAgo },
          eventType: 'page_view'
        }},
        { $sort: { timestamp: -1 } },
        { $group: {
          _id: '$sessionId',
          visitorId: { $first: '$visitorId' },
          pageUrl: { $first: '$pageUrl' },
          pageTitle: { $first: '$pageTitle' },
          country: { $first: '$country' },
          city: { $first: '$city' },
          deviceType: { $first: '$deviceType' },
          browser: { $first: '$browser' },
          os: { $first: '$os' },
          timeOnPage: { $first: '$timeOnPage' },
          lastActive: { $first: '$timestamp' }
        }},
        { $project: {
          sessionId: '$_id',
          visitorId: 1,
          pageUrl: 1,
          pageTitle: 1,
          country: 1,
          city: 1,
          deviceType: 1,
          browser: 1,
          os: 1,
          timeOnPage: 1,
          lastActive: 1,
          activeFor: {
            $subtract: [new Date(), '$lastActive']
          }
        }}
      ]);

      return activeSessions;
    } catch (error) {
      console.error('Error getting real-time visitors:', error);
      throw error;
    }
  }

  // Get visitor journey for a specific session
  static async getVisitorJourney(sessionId: string) {
    try {
      const events = await AnalyticsEvent.find({ sessionId })
        .sort({ timestamp: 1 })
        .select('eventType pageUrl pageTitle timestamp timeOnPage scrollDepth')
        .lean();
      
      return events;
    } catch (error) {
      console.error('Error getting visitor journey:', error);
      throw error;
    }
  }

  // Get individual visitor details
  static async getVisitorDetails(visitorId: string) {
    try {
      const visitorData = await AnalyticsEvent.aggregate([
        { $match: { visitorId } },
        { $sort: { timestamp: -1 } },
        { $group: {
          _id: '$visitorId',
          firstVisit: { $min: '$timestamp' },
          lastVisit: { $max: '$timestamp' },
          totalVisits: { $addToSet: '$sessionId' },
          totalPageViews: { $sum: 1 },
          totalTimeSpent: { $sum: '$timeOnPage' },
          countries: { $addToSet: '$country' },
          devices: { $addToSet: '$deviceType' },
          browsers: { $addToSet: '$browser' },
          pages: { $addToSet: '$pageUrl' },
          recentActivity: { $push: {
            timestamp: '$timestamp',
            eventType: '$eventType',
            pageUrl: '$pageUrl',
            pageTitle: '$pageTitle'
          }}
        }},
        { $project: {
          visitorId: '$_id',
          firstVisit: 1,
          lastVisit: 1,
          totalVisits: { $size: '$totalVisits' },
          totalPageViews: 1,
          avgTimePerVisit: {
            $cond: [
              { $gt: [{ $size: '$totalVisits' }, 0] },
              { $divide: ['$totalTimeSpent', { $size: '$totalVisits' }] },
              0
            ]
          },
          countries: 1,
          devices: 1,
          browsers: 1,
          pages: { $size: '$pages' },
          recentActivity: { $slice: ['$recentActivity', 20] }
        }}
      ]);

      return visitorData[0] || null;
    } catch (error) {
      console.error('Error getting visitor details:', error);
      throw error;
    }
  }
}