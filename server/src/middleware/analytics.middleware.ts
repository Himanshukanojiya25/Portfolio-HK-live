import { Request, Response, NextFunction } from 'express';
import Visitor from '../models/Visitor.model.js';
import { getClientIP, getUserAgent, parseUserAgent } from '../utils/analytics.utils.js';

export interface AnalyticsRequest extends Request {
  visitorData?: {
    sessionId: string;
    visitorId: string;
    startTime: number;
  };
}

// Generate unique IDs
const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Check if request should be tracked (avoid tracking assets, API calls, etc.)
const shouldTrack = (req: Request): boolean => {
  const path = req.path;
  
  // Don't track these paths
  const excludedPaths = [
    '/api/',
    '/_next/',
    '/static/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '.css',
    '.js',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg'
  ];

  return !excludedPaths.some(excluded => path.includes(excluded));
};

// Main analytics middleware
export const analyticsMiddleware = {
  // Track page visits
  trackVisit: async (req: AnalyticsRequest, res: Response, next: NextFunction) => {
    try {
      // Skip if shouldn't track
      if (!shouldTrack(req)) {
        return next();
      }

      // Get client information
      const ipAddress = getClientIP(req);
      const userAgent = getUserAgent(req);
      const ua = parseUserAgent(userAgent);

      // Generate or get session/visitor IDs from cookies
      let sessionId = req.cookies?.session_id;
      let visitorId = req.cookies?.visitor_id;

      if (!sessionId) {
        sessionId = generateId();
        // Set session cookie (expires when browser closes)
        res.cookie('session_id', sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
      }

      if (!visitorId) {
        visitorId = generateId();
        // Set visitor cookie (expires in 1 year)
        res.cookie('visitor_id', visitorId, {
          maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
      }

      // Check if this is first visit
      const existingVisitor = await Visitor.findOne({ visitorId });
      const firstVisit = !existingVisitor;

      // Create visitor record
      const visitor = new Visitor({
        sessionId,
        visitorId,
        ipAddress,
        userAgent,
        browser: ua.browser,
        browserVersion: ua.version,
        os: ua.os,
        deviceType: ua.deviceType,
        platform: ua.platform,
        url: req.url,
        referrer: req.get('Referer') || 'direct',
        pageTitle: '', // Will be set from frontend
        timeOnPage: 0, // Will be updated when user leaves
        scrollDepth: 0, // Will be updated from frontend
        firstVisit,
        screenResolution: req.headers['sec-ch-width'] ? 
          `${req.headers['sec-ch-width']}x${req.headers['sec-ch-height']}` : undefined,
        language: req.headers['accept-language']?.split(',')[0],
        visitTime: new Date()
      });

      // Save visitor record (don't await to avoid blocking)
      visitor.save().catch(error => {
        console.error('Failed to save visitor record:', error);
      });

      // Store visitor data in request for later use
      req.visitorData = {
        sessionId,
        visitorId,
        startTime: Date.now()
      };

      next();
    } catch (error) {
      console.error('Analytics middleware error:', error);
      // Don't block the request if analytics fails
      next();
    }
  },

  // Track page engagement (time on page, scroll depth)
  trackEngagement: async (req: AnalyticsRequest, res: Response, next: NextFunction) => {
    const originalSend = res.send;

    res.send = function (body: any) {
      // Only add tracking for HTML responses
      if (typeof body === 'string' && body.includes('</html>') && req.visitorData) {
        // Add analytics script to the page
        const analyticsScript = `
          <script>
            // Page engagement tracking
            (function() {
              const startTime = Date.now();
              let maxScroll = 0;
              let sentData = false;

              // Track scroll depth
              window.addEventListener('scroll', function() {
                const scrollPercent = Math.round(
                  (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                );
                maxScroll = Math.max(maxScroll, scrollPercent);
              });

              // Track when user leaves the page
              window.addEventListener('beforeunload', function() {
                if (!sentData) {
                  const timeOnPage = Date.now() - startTime;
                  sendEngagementData(timeOnPage, maxScroll);
                  sentData = true;
                }
              });

              // Also send data if user stays on page for a while
              setTimeout(function() {
                if (!sentData) {
                  sendEngagementData(30000, maxScroll); // 30 seconds default
                  sentData = true;
                }
              }, 30000);

              function sendEngagementData(timeOnPage, scrollDepth) {
                // Send to basic engagement endpoint
                fetch('/api/analytics/engagement', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    sessionId: '${req.visitorData?.sessionId}',
                    timeOnPage: timeOnPage,
                    scrollDepth: scrollDepth,
                    url: '${req.url}'
                  })
                }).catch(console.error);
              }
            })();
          </script>
        `;

        // Insert script before closing body tag
        if (body.includes('</body>')) {
          body = body.replace('</body>', analyticsScript + '</body>');
        } else {
          body += analyticsScript;
        }
      }

      return originalSend.call(this, body);
    };

    next();
  },

  // Advanced event tracking middleware (temporarily disabled)
  trackAdvancedEvents: async (req: AnalyticsRequest, res: Response, next: NextFunction) => {
    // Temporarily disabled - will implement later
    next();
  }
};

export default analyticsMiddleware;