import { api } from './api';

export interface AnalyticsData {
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  visitorsData: { date: string; visitors: number }[];
  pageViewsData: { date: string; views: number }[];
  trafficSources: { source: string; visitors: number; percentage: number }[];
  popularPages: { page: string; views: number; visitors: number }[];
  devices: { device: string; visitors: number; percentage: number }[];
  locations: { country: string; visitors: number; percentage: number }[];
}

export interface ContactAnalytics {
  totalMessages: number;
  respondedMessages: number;
  responseRate: number;
  messagesByDate: { date: string; messages: number }[];
  popularTopics: { topic: string; count: number }[];
}

export interface ProjectAnalytics {
  totalViews: number;
  totalLikes: number;
  mostViewed: {
    id: string;
    title: string;
    views: number;
    likes: number;
  }[];
  viewsByDate: { date: string; views: number }[];
}

export const analyticsAPI = {
  // Get overall analytics
  getAnalytics: async (period: string = '7d'): Promise<{ data: AnalyticsData }> => {
    const response = await api.get(`/api/admin/analytics?period=${period}`);
    return response;
  },

  // Get contact analytics
  getContactAnalytics: async (period: string = '7d'): Promise<{ data: ContactAnalytics }> => {
    const response = await api.get(`/api/admin/analytics/contact?period=${period}`);
    return response;
  },

  // Get project analytics
  getProjectAnalytics: async (period: string = '7d'): Promise<{ data: ProjectAnalytics }> => {
    const response = await api.get(`/api/admin/analytics/projects?period=${period}`);
    return response;
  },

  // Get real-time visitors
  getRealtimeVisitors: async (): Promise<{ data: { active: number } }> => {
    const response = await api.get('/api/admin/analytics/realtime');
    return response;
  },

  // Track page view
  trackPageView: async (page: string): Promise<void> => {
    await api.post('/api/analytics/pageview', { page });
  },

  // Track contact submission
  trackContact: async (): Promise<void> => {
    await api.post('/api/analytics/contact');
  },

  // Track project view
  trackProjectView: async (projectId: string): Promise<void> => {
    await api.post('/api/analytics/project-view', { projectId });
  },
};