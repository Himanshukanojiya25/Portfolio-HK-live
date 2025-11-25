import { Request, Response, NextFunction } from 'express';
import Visitor from '../models/Visitor.model.js';
import { getClientIP, getUserAgent, parseUserAgent } from '../utils/analytics.utils.js';
import advancedAnalyticsService from '../services/advancedAnalytics.service.js';

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

      // ✅ ADDED: Track page view with advanced analytics
      try {
        const eventData: any = {
          eventType: 'page_view',
          eventCategory: 'Page View',
          eventAction: 'View',
          eventLabel: req.url,
          sessionId: sessionId,
          visitorId: visitorId,
          pageUrl: req.url,
          pageTitle: '', // Can be set from frontend
          userAgent: userAgent,
          ipAddress: ipAddress
        };

        // ✅ FIXED: Add previousPage only if referrer exists
        const referrer = req.get('Referer');
        if (referrer) {
          eventData.previousPage = referrer;
        }

        await advancedAnalyticsService.trackEvent(eventData);
      } catch (trackingError) {
        console.error('Failed to track page view:', trackingError);
        // Don't block request if advanced tracking fails
      }

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
                
                // ✅ ADDED: Track scroll events for advanced analytics
                if (scrollPercent % 25 === 0) { // Track every 25% scroll
                  fetch('/api/analytics/advanced/track', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      eventType: 'scroll',
                      eventCategory: 'Engagement',
                      eventAction: 'Scroll',
                      eventLabel: 'Scroll Depth',
                      eventValue: scrollPercent,
                      sessionId: '${req.visitorData?.sessionId}',
                      visitorId: '${req.visitorData?.visitorId}',
                      pageUrl: '${req.url}',
                      pageTitle: document.title,
                      scrollDepth: scrollPercent,
                      elementId: 'page-body'
                    })
                  }).catch(console.error);
                }
              });

              // Track clicks for advanced analytics
              document.addEventListener('click', function(e) {
                const target = e.target;
                const elementId = target.id || '';
                const elementClass = target.className || '';
                const elementText = target.textContent?.substring(0, 50) || '';
                
                // Track important clicks (buttons, links, etc.)
                if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
                  fetch('/api/analytics/advanced/track', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      eventType: 'click',
                      eventCategory: 'Engagement',
                      eventAction: 'Click',
                      eventLabel: elementText || elementId || elementClass,
                      sessionId: '${req.visitorData?.sessionId}',
                      visitorId: '${req.visitorData?.visitorId}',
                      pageUrl: '${req.url}',
                      pageTitle: document.title,
                      elementId: elementId,
                      elementClass: elementClass,
                      elementText: elementText
                    })
                  }).catch(console.error);
                }
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
                
                // ✅ ADDED: Also send to advanced analytics
                fetch('/api/analytics/advanced/track', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    eventType: 'page_view',
                    eventCategory: 'Engagement',
                    eventAction: 'Page Exit',
                    eventLabel: 'Time on Page',
                    eventValue: timeOnPage,
                    sessionId: '${req.visitorData?.sessionId}',
                    visitorId: '${req.visitorData?.visitorId}',
                    pageUrl: '${req.url}',
                    pageTitle: document.title,
                    scrollDepth: scrollDepth
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

  // ✅ ADDED: Advanced event tracking middleware
  trackAdvancedEvents: async (req: AnalyticsRequest, res: Response, next: NextFunction) => {
    try {
      // Track form submissions
      if (req.method === 'POST' && req.visitorData) {
        const formEndpoints = [
          '/api/contact',
          '/api/comments',
          '/api/auth/register',
          '/api/auth/login'
        ];

        if (formEndpoints.some(endpoint => req.url.startsWith(endpoint))) {
          setTimeout(async () => {
            try {
              await advancedAnalyticsService.trackEvent({
                eventType: 'form_submit',
                eventCategory: 'Form',
                eventAction: 'Submit',
                eventLabel: req.url,
                sessionId: req.visitorData!.sessionId,
                visitorId: req.visitorData!.visitorId,
                pageUrl: req.url,
                pageTitle: 'Form Submission',
                userAgent: req.headers['user-agent'] || 'Unknown',
                ipAddress: getClientIP(req),
                formData: { endpoint: req.url }
              });
            } catch (error) {
              console.error('Failed to track form submission:', error);
            }
          }, 100); // Small delay to ensure form processing
        }
      }

      next();
    } catch (error) {
      console.error('Advanced event tracking error:', error);
      next(); // Don't block request if analytics fails
    }
  }
};

export default analyticsMiddleware;