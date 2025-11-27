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

export const adminAPI = {
  // ✅ FIXED: Authentication endpoints
  login: async (email: string, password: string): Promise<{ data: LoginResponse }> => {
    const response = await api.post('/api/auth/login', { email, password });
    return response;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },

  // ✅ FIXED: Changed from /api/admin/profile to /api/auth/profile
  getProfile: async (): Promise<{ data: any }> => {
    const response = await api.get('/api/auth/profile');
    return response;
  },

  // Dashboard
  getDashboardStats: async (): Promise<{ data: DashboardStats }> => {
    const response = await api.get('/api/admin/dashboard/stats');
    return response;
  },

  getQuickActions: async (): Promise<{ data: QuickActionsData }> => {
    const response = await api.get('/api/admin/quick-actions');
    return response;
  },

  // Analytics
  getAnalyticsData: async (period: string = '7d'): Promise<{ data: any }> => {
    const response = await api.get(`/api/admin/analytics?period=${period}`);
    return response;
  },

  getSystemMetrics: async (): Promise<{ data: any }> => {
    const response = await api.get('/api/admin/system/metrics');
    return response;
  },

  getContentOverview: async (): Promise<{ data: any }> => {
    const response = await api.get('/api/admin/content/overview');
    return response;
  }
};

export default adminAPI;