import { api } from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
  token: string;
}

export interface DashboardStats {
  overview: {
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
    totalProjects: number;
    publishedProjects: number;
    totalContacts: number;
    pendingContacts: number;
    totalSkills: number;
    featuredSkills: number;
    totalComments: number;
    pendingComments: number;
  };
  analytics: {
    todayVisitors: number;
    weekVisitors: number;
    monthVisitors: number;
    totalVisitors: number;
  };
  recentActivities: {
    blogs: any[];
    projects: any[];
    contacts: any[];
    comments: any[];
  };
}

export interface QuickActionsData {
  recentProjects: any[];
  recentContacts: any[];
  popularSkills: any[];
}

// ✅ IMPORTANT: baseURL already has '/api'
// So all endpoints below should NOT include '/api' prefix

export const adminAPI = {
  // Authentication
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response;
  },

  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response;
  },

  getQuickActions: async () => {
    const response = await api.get('/admin/quick-actions');
    return response;
  },

  // Analytics
  getAnalyticsData: async (period: string = '7d') => {
    const response = await api.get(`/admin/analytics?period=${period}`);
    return response;
  },

  getSystemMetrics: async () => {
    const response = await api.get('/admin/system/metrics');
    return response;
  },

  getContentOverview: async () => {
    const response = await api.get('/admin/content/overview');
    return response;
  },
};

export default adminAPI;