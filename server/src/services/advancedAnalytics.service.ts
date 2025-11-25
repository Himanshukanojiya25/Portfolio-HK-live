import AdvancedAnalytics from '../models/AdvancedAnalytics.model.js';
import AnalyticsEvent from '../models/AnalyticsEvent.model.js';
import Visitor from '../models/Visitor.model.js';
import Blog from '../models/Blog.model.js';
import Project from '../models/Project.model.js';
import Contact from '../models/Contact.model.js';

export const advancedAnalyticsService = {
  // Process and generate advanced analytics for a specific period
  generateAdvancedAnalytics: async (date: Date, period: 'daily' | 'weekly' | 'monthly') => {
    try {
      const startDate = new Date(date);
      const endDate = new Date(date);
      
      // Set date range based on period
      switch (period) {
        case 'daily':
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'weekly':
          startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of week (Sunday)
          endDate.setDate(startDate.getDate() + 6); // End of week (Saturday)
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'monthly':
          startDate.setDate(1); // First day of month
          startDate.setHours(0, 0, 0, 0);
          endDate.setMonth(endDate.getMonth() + 1, 0); // Last day of month
          endDate.setHours(23, 59, 59, 999);
          break;
      }

      console.log(`📊 Generating ${period} analytics for ${startDate.toISOString()} to ${endDate.toISOString()}`);

      // Get all data in parallel for better performance
      const [
        visitors,
        events,
        blogs,
        projects,
        contacts
      ] = await Promise.all([
        Visitor.find({ visitTime: { $gte: startDate, $lte: endDate } }),
        AnalyticsEvent.find({ createdAt: { $gte: startDate, $lte: endDate } }),
        Blog.find({ publishedAt: { $gte: startDate, $lte: endDate } }),
        Project.find({ createdAt: { $gte: startDate, $lte: endDate } }),
        Contact.find({ createdAt: { $gte: startDate, $lte: endDate } })
      ]);

      // Calculate advanced metrics
      const analyticsData = await calculateAdvancedMetrics(
        visitors,
        events,
        blogs,
        projects,
        contacts,
        startDate,
        endDate,
        period
      );

      // Save or update analytics record
      const existingAnalytics = await AdvancedAnalytics.findOne({
        date: startDate,
        period
      });

      if (existingAnalytics) {
        // Update existing record
        await AdvancedAnalytics.findByIdAndUpdate(existingAnalytics._id, analyticsData);
        console.log(`✅ Updated ${period} analytics for ${startDate.toISOString()}`);
      } else {
        // Create new record
        await AdvancedAnalytics.create(analyticsData);
        console.log(`✅ Created ${period} analytics for ${startDate.toISOString()}`);
      }

      return analyticsData;

    } catch (error) {
      console.error('❌ Error generating advanced analytics:', error);
      throw error;
    }
  },

  // Get comprehensive analytics report
  getComprehensiveReport: async (startDate: Date, endDate: Date) => {
    try {
      const [
        visitors,
        events,
        pageViews,
        clicks,
        formSubmissions,
        downloads,
        blogs,
        projects,
        contacts
      ] = await Promise.all([
        // Visitor data
        Visitor.find({ visitTime: { $gte: startDate, $lte: endDate } }),
        AnalyticsEvent.find({ createdAt: { $gte: startDate, $lte: endDate } }),
        
        // Event types
        AnalyticsEvent.find({ 
          createdAt: { $gte: startDate, $lte: endDate },
          eventType: 'page_view'
        }),
        AnalyticsEvent.find({ 
          createdAt: { $gte: startDate, $lte: endDate },
          eventType: 'click'
        }),
        AnalyticsEvent.find({ 
          createdAt: { $gte: startDate, $lte: endDate },
          eventType: 'form_submit'
        }),
        AnalyticsEvent.find({ 
          createdAt: { $gte: startDate, $lte: endDate },
          eventType: 'download'
        }),
        
        // Content data
        Blog.find({ publishedAt: { $gte: startDate, $lte: endDate } }),
        Project.find({ createdAt: { $gte: startDate, $lte: endDate } }),
        Contact.find({ createdAt: { $gte: startDate, $lte: endDate } })
      ]);

      // Calculate comprehensive metrics
      const report = {
        summary: calculateSummaryMetrics(visitors, events, blogs, projects, contacts),
        trafficAnalysis: analyzeTrafficSources(visitors, events),
        userBehavior: analyzeUserBehavior(visitors, events, pageViews),
        contentPerformance: analyzeContentPerformance(blogs, projects, events),
        conversionAnalysis: analyzeConversions(contacts, events, visitors),
        technicalPerformance: analyzeTechnicalPerformance(events)
      };

      return report;

    } catch (error) {
      console.error('❌ Error generating comprehensive report:', error);
      throw error;
    }
  },

  // Track custom analytics events
  trackEvent: async (eventData: {
    eventType: 'page_view' | 'click' | 'scroll' | 'form_submit' | 'download' | 'share' | 'custom';
    eventCategory: string;
    eventAction: string;
    eventLabel?: string;
    eventValue?: number;
    sessionId: string;
    visitorId: string;
    userId?: string;
    pageUrl: string;
    pageTitle: string;
    userAgent: string;
    ipAddress: string;
    elementId?: string;
    elementClass?: string;
    elementText?: string;
    scrollDepth?: number;
    formData?: any;
    pageLoadTime?: number;
  }) => {
    try {
      const event = new AnalyticsEvent(eventData);
      await event.save();
      
      console.log(`📈 Tracked event: ${eventData.eventCategory} - ${eventData.eventAction}`);
      return event;
    } catch (error) {
      console.error('❌ Error tracking event:', error);
      throw error;
    }
  },

  // Get real-time analytics
  getRealTimeAnalytics: async (hours: number = 24) => {
    try {
      const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
      
      const [
        activeVisitors,
        recentEvents,
        topPages,
        trafficSources
      ] = await Promise.all([
        // Active visitors (last 30 minutes)
        Visitor.countDocuments({ 
          visitTime: { $gte: new Date(Date.now() - 30 * 60 * 1000) } 
        }),
        
        // Recent events
        AnalyticsEvent.find({ 
          createdAt: { $gte: startTime } 
        })
        .sort({ createdAt: -1 })
        .limit(50),
        
        // Top pages in real-time
        AnalyticsEvent.aggregate([
          {
            $match: {
              createdAt: { $gte: startTime },
              eventType: 'page_view'
            }
          },
          {
            $group: {
              _id: '$pageUrl',
              visits: { $sum: 1 },
              title: { $first: '$pageTitle' }
            }
          },
          {
            $sort: { visits: -1 }
          },
          {
            $limit: 10
          }
        ]),
        
        // Traffic sources
        Visitor.aggregate([
          {
            $match: {
              visitTime: { $gte: startTime }
            }
          },
          {
            $group: {
              _id: '$referrer',
              visits: { $sum: 1 }
            }
          },
          {
            $sort: { visits: -1 }
          },
          {
            $limit: 10
          }
        ])
      ]);

      return {
        activeVisitors,
        recentEvents,
        topPages,
        trafficSources,
        timeframe: `${hours} hours`
      };

    } catch (error) {
      console.error('❌ Error getting real-time analytics:', error);
      throw error;
    }
  },

  // Generate analytics insights and recommendations
  generateInsights: async (days: number = 30) => {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const report = await advancedAnalyticsService.getComprehensiveReport(startDate, new Date());

      const insights = {
        performance: generatePerformanceInsights(report),
        content: generateContentInsights(report),
        userExperience: generateUserExperienceInsights(report),
        opportunities: generateOpportunityInsights(report)
      };

      return insights;

    } catch (error) {
      console.error('❌ Error generating insights:', error);
      throw error;
    }
  }
};

// Helper functions for complex calculations
const calculateAdvancedMetrics = async (
  visitors: any[],
  events: any[],
  blogs: any[],
  projects: any[],
  contacts: any[],
  startDate: Date,
  endDate: Date,
  period: string
) => {
  // This would contain complex aggregation logic
  // Simplified for example purposes
  return {
    date: startDate,
    period,
    totalVisits: visitors.length,
    uniqueVisitors: new Set(visitors.map(v => v.visitorId)).size,
    // ... other calculated metrics
  };
};

const calculateSummaryMetrics = (visitors: any[], events: any[], blogs: any[], projects: any[], contacts: any[]) => {
  // Implementation for summary metrics
  return {
    totalVisits: visitors.length,
    uniqueVisitors: new Set(visitors.map(v => v.visitorId)).size,
    totalEvents: events.length,
    // ... other metrics
  };
};

const analyzeTrafficSources = (visitors: any[], events: any[]) => {
  // Implementation for traffic source analysis
  return {};
};

const analyzeUserBehavior = (visitors: any[], events: any[], pageViews: any[]) => {
  // Implementation for user behavior analysis
  return {};
};

const analyzeContentPerformance = (blogs: any[], projects: any[], events: any[]) => {
  // Implementation for content performance analysis
  return {};
};

const analyzeConversions = (contacts: any[], events: any[], visitors: any[]) => {
  // Implementation for conversion analysis
  return {};
};

const analyzeTechnicalPerformance = (events: any[]) => {
  // Implementation for technical performance analysis
  return {};
};

const generatePerformanceInsights = (report: any) => {
  // Implementation for performance insights
  return [];
};

const generateContentInsights = (report: any) => {
  // Implementation for content insights
  return [];
};

const generateUserExperienceInsights = (report: any) => {
  // Implementation for user experience insights
  return [];
};

const generateOpportunityInsights = (report: any) => {
  // Implementation for opportunity insights
  return [];
};

export default advancedAnalyticsService;