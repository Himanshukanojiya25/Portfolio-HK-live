import Visitor from '../models/Visitor.model.js';
import Analytics from '../models/Analytics.model.js';

export const analyticsService = {
  // Update engagement data (time on page, scroll depth)
  updateEngagement: async (sessionId: string, timeOnPage: number, scrollDepth: number) => {
    try {
      const visitor = await Visitor.findOne({ sessionId });
      
      if (visitor) {
        visitor.timeOnPage = timeOnPage;
        visitor.scrollDepth = scrollDepth;
        visitor.leaveTime = new Date();
        await visitor.save();
        
        console.log(`✅ Engagement updated for session ${sessionId}: ${timeOnPage}ms, ${scrollDepth}% scroll`);
        return true;
      }
      
      console.warn(`⚠️ Visitor not found for session: ${sessionId}`);
      return false;
    } catch (error) {
      console.error('❌ Error updating engagement:', error);
      return false;
    }
  },

  // Get visitor statistics
  getVisitorStats: async () => {
    try {
      return await Visitor.getVisitorStats();
    } catch (error) {
      console.error('❌ Error getting visitor stats:', error);
      throw error;
    }
  },

  // Get analytics for dashboard
  getDashboardAnalytics: async (days: number = 30) => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get visitor data for the period
      const visitors = await Visitor.find({
        visitTime: { $gte: startDate }
      }).sort({ visitTime: -1 });

      // Calculate basic stats
      const totalVisits = visitors.length;
      const uniqueVisitors = new Set(visitors.map(v => v.visitorId)).size;
      
      // Device breakdown
      const deviceBreakdown = visitors.reduce((acc, visitor) => {
        const device = visitor.deviceType || 'desktop';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Browser breakdown
      const browserBreakdown = visitors.reduce((acc, visitor) => {
        const browser = visitor.browser || 'Unknown';
        acc[browser] = (acc[browser] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Country breakdown
      const countryBreakdown = visitors.reduce((acc, visitor) => {
        const country = visitor.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Page views
      const pageViews = visitors.reduce((acc, visitor) => {
        const page = visitor.url || 'Unknown';
        acc[page] = (acc[page] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Average time on site
      const totalTime = visitors.reduce((sum, visitor) => sum + (visitor.timeOnPage || 0), 0);
      const avgTimeOnSite = totalVisits > 0 ? Math.round(totalTime / totalVisits) : 0;

      // Bounce rate (visits with less than 10 seconds)
      const bounces = visitors.filter(v => (v.timeOnPage || 0) < 10000).length;
      const bounceRate = totalVisits > 0 ? Math.round((bounces / totalVisits) * 100) : 0;

      return {
        summary: {
          totalVisits,
          uniqueVisitors,
          avgTimeOnSite,
          bounceRate
        },
        devices: deviceBreakdown,
        browsers: browserBreakdown,
        countries: countryBreakdown,
        pages: pageViews,
        recentVisitors: visitors.slice(0, 10).map(v => ({
          country: v.country,
          device: v.deviceType,
          browser: v.browser,
          timeOnPage: v.timeOnPage,
          visitTime: v.visitTime
        }))
      };
    } catch (error) {
      console.error('❌ Error getting dashboard analytics:', error);
      throw error;
    }
  },

  // Get daily analytics for charts
  getDailyAnalytics: async (days: number = 30) => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

      const visitors = await Visitor.aggregate([
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
            uniqueVisitors: { $addToSet: '$visitorId' },
            totalTime: { $sum: '$timeOnPage' }
          }
        },
        {
          $project: {
            date: '$_id',
            visits: 1,
            uniqueVisitors: { $size: '$uniqueVisitors' },
            avgTimeOnPage: {
              $cond: [
                { $eq: ['$visits', 0] },
                0,
                { $divide: ['$totalTime', '$visits'] }
              ]
            }
          }
        },
        {
          $sort: { date: 1 }
        }
      ]);

      return visitors;
    } catch (error) {
      console.error('❌ Error getting daily analytics:', error);
      throw error;
    }
  },

  // Clean up old analytics data
  cleanupOldData: async (retentionDays: number = 30) => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const result = await Visitor.deleteMany({
        visitTime: { $lt: cutoffDate }
      });

      console.log(`🧹 Cleaned up ${result.deletedCount} old visitor records`);
      return result.deletedCount;
    } catch (error) {
      console.error('❌ Error cleaning up old data:', error);
      throw error;
    }
  }
};

export default analyticsService;