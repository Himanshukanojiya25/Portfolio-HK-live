import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface AnalyticsFilters {
  startDate?: Date;
  endDate?: Date;
  country?: string;
  deviceType?: string;
  pageUrl?: string;
  limit?: number;
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

export interface TimeSeriesData {
  date: string;
  visitors: number;
  pageViews: number;
  sessions: number;
  avgTimeOnPage: number;
  bounceRate: number;
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
  activeFor: number;
  lastActive: string;
}

class AnalyticsService {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/analytics`,
    withCredentials: true
  });

  // ✅ CONSTRUCTOR FOR AUTH INTERCEPTOR
  constructor() {
    // Request interceptor to add token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error('Authentication failed - Token expired or invalid');
          // You can redirect to login page here if needed
          // window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // ✅ MOCK DATA FALLBACK (Temporary for testing)
  private mockSummary: AnalyticsSummary = {
    totalVisitors: 1542,
    totalPageViews: 8756,
    totalSessions: 2314,
    avgSessionDuration: 125000,
    bounceRate: 42.5,
    returningVisitors: 512,
    newVisitors: 1030
  };

  private mockTimeSeries: TimeSeriesData[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      visitors: Math.floor(Math.random() * 200) + 50,
      pageViews: Math.floor(Math.random() * 500) + 100,
      sessions: Math.floor(Math.random() * 150) + 30,
      avgTimeOnPage: Math.floor(Math.random() * 120000) + 30000,
      bounceRate: Math.floor(Math.random() * 30) + 20
    };
  });

  private mockDevices: DeviceData[] = [
    { deviceType: 'desktop', count: 850, percentage: 55 },
    { deviceType: 'mobile', count: 520, percentage: 34 },
    { deviceType: 'tablet', count: 172, percentage: 11 }
  ];

  private mockLocations: LocationData[] = [
    { country: 'United States', countryCode: 'US', visitors: 540, pageViews: 2540 },
    { country: 'India', countryCode: 'IN', visitors: 320, pageViews: 1870 },
    { country: 'Germany', countryCode: 'DE', visitors: 185, pageViews: 920 },
    { country: 'United Kingdom', countryCode: 'GB', visitors: 156, pageViews: 780 },
    { country: 'Canada', countryCode: 'CA', visitors: 98, pageViews: 450 }
  ];

  private mockRealTimeVisitors: RealTimeVisitor[] = [
    {
      sessionId: 'session_001',
      visitorId: 'visitor_001',
      pageUrl: '/',
      pageTitle: 'Home',
      country: 'United States',
      city: 'New York',
      deviceType: 'desktop',
      browser: 'Chrome',
      os: 'Windows',
      timeOnPage: 45000,
      activeFor: 120,
      lastActive: new Date().toISOString()
    },
    {
      sessionId: 'session_002',
      visitorId: 'visitor_002',
      pageUrl: '/projects',
      pageTitle: 'Projects',
      country: 'India',
      city: 'Mumbai',
      deviceType: 'mobile',
      browser: 'Safari',
      os: 'iOS',
      timeOnPage: 65000,
      activeFor: 85,
      lastActive: new Date(Date.now() - 60000).toISOString()
    }
  ];

  // Track an event
  async trackEvent(eventData: any) {
    try {
      const response = await this.api.post('/track', eventData);
      return response.data;
    } catch (error) {
      console.error('Error tracking event:', error);
      throw error;
    }
  }

  // Get analytics summary
  async getSummary(filters?: AnalyticsFilters): Promise<AnalyticsSummary> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());
      if (filters?.country) params.append('country', filters.country);
      if (filters?.deviceType) params.append('deviceType', filters.deviceType);
      if (filters?.pageUrl) params.append('pageUrl', filters.pageUrl);

      const response = await this.api.get(`/summary?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting analytics summary, using mock data:', error);
      // Return mock data for now
      return this.mockSummary;
    }
  }

  // Get time series data
  async getTimeSeries(filters?: AnalyticsFilters): Promise<TimeSeriesData[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());

      const response = await this.api.get(`/time-series?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting time series, using mock data:', error);
      return this.mockTimeSeries;
    }
  }

  // Get top pages
  async getTopPages(filters?: AnalyticsFilters): Promise<TopPagesData[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await this.api.get(`/top-pages?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting top pages, using mock data:', error);
      return [
        { pageUrl: '/', pageTitle: 'Home', visitors: 1254, pageViews: 3456, avgTimeOnPage: 45000, bounceRate: 32 },
        { pageUrl: '/projects', pageTitle: 'Projects', visitors: 867, pageViews: 2345, avgTimeOnPage: 65000, bounceRate: 28 },
        { pageUrl: '/about', pageTitle: 'About', visitors: 654, pageViews: 1876, avgTimeOnPage: 55000, bounceRate: 35 },
        { pageUrl: '/contact', pageTitle: 'Contact', visitors: 432, pageViews: 987, avgTimeOnPage: 75000, bounceRate: 25 }
      ];
    }
  }

  // Get device breakdown
  async getDeviceBreakdown(filters?: AnalyticsFilters): Promise<DeviceData[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());

      const response = await this.api.get(`/device-breakdown?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting device breakdown, using mock data:', error);
      return this.mockDevices;
    }
  }

  // Get location data
  async getLocationData(filters?: AnalyticsFilters): Promise<LocationData[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await this.api.get(`/locations?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting location data, using mock data:', error);
      return this.mockLocations;
    }
  }

  // Get real-time visitors
  async getRealTimeVisitors(): Promise<RealTimeVisitor[]> {
    try {
      const response = await this.api.get('/real-time');
      return response.data.data;
    } catch (error) {
      console.error('Error getting real-time visitors, using mock data:', error);
      return this.mockRealTimeVisitors;
    }
  }

  // Get visitor details
  async getVisitorDetails(visitorId: string): Promise<any> {
    try {
      const response = await this.api.get(`/visitor/${visitorId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting visitor details:', error);
      throw error;
    }
  }

  // Get visitor journey
  async getVisitorJourney(sessionId: string): Promise<any[]> {
    try {
      const response = await this.api.get(`/journey/${sessionId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting visitor journey:', error);
      throw error;
    }
  }

  // Export data
  async exportData(filters?: AnalyticsFilters): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());

      const response = await this.api.get(`/export?${params}`, {
        responseType: 'blob'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  // Frontend tracking functions
  trackPageView(pageUrl: string, pageTitle: string, timeOnPage?: number, scrollDepth?: number) {
    return this.trackEvent({
      eventType: 'page_view',
      eventCategory: 'Page View',
      eventAction: 'View',
      eventLabel: pageTitle,
      pageUrl,
      pageTitle,
      timeOnPage,
      scrollDepth
    });
  }

  trackClick(elementId: string, elementText: string, pageUrl: string) {
    return this.trackEvent({
      eventType: 'click',
      eventCategory: 'Engagement',
      eventAction: 'Click',
      eventLabel: elementText,
      elementId,
      pageUrl
    });
  }

  trackScroll(scrollDepth: number, pageUrl: string) {
    return this.trackEvent({
      eventType: 'scroll',
      eventCategory: 'Engagement',
      eventAction: 'Scroll',
      eventLabel: 'Scroll Depth',
      eventValue: scrollDepth,
      pageUrl
    });
  }

  trackFormSubmit(formName: string, pageUrl: string) {
    return this.trackEvent({
      eventType: 'form_submit',
      eventCategory: 'Form',
      eventAction: 'Submit',
      eventLabel: formName,
      pageUrl
    });
  }

  trackDownload(fileName: string, pageUrl: string) {
    return this.trackEvent({
      eventType: 'download',
      eventCategory: 'Download',
      eventAction: 'Download',
      eventLabel: fileName,
      pageUrl
    });
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;