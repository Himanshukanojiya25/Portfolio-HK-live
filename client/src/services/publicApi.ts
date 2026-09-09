import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/public';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Project {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  status: string;
  techStack: string[];
  featuredImage: string;
  images: string[];
  liveUrl?: string;
  repositoryUrl?: string;
  startDate: string;
  endDate?: string;
  isPublic: boolean;
  isFeatured: boolean;
  displayOrder: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  color?: string;
  isPublic: boolean;
  order: number;
}

export interface Testimonial {
  _id: string;
  clientName: string;
  clientRole: string;
  clientCompany?: string;
  clientImage?: string;
  content: string;
  rating: number;
  isPublic: boolean;
  createdAt: string;
}

// Projects API
export const projectApi = {
  getAll: async (params?: { category?: string; featured?: boolean; limit?: number }) => {
    const response = await apiClient.get('/projects', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },
  
  getFeatured: async () => {
    const response = await apiClient.get('/projects/featured');
    return response.data;
  }
};

// Skills API
export const skillApi = {
  getAll: async () => {
    const response = await apiClient.get('/skills');
    return response.data;
  },
  
  getByCategory: async (category: string) => {
    const response = await apiClient.get(`/skills/category/${category}`);
    return response.data;
  }
};

// Testimonials API
export const testimonialApi = {
  getAll: async () => {
    const response = await apiClient.get('/testimonials');
    return response.data;
  },
  
  getFeatured: async () => {
    const response = await apiClient.get('/testimonials/featured');
    return response.data;
  }
};

// Contact API
export const contactApi = {
  submit: async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    const response = await apiClient.post('/contact', data);
    return response.data;
  }
};

// Stats API
export const statsApi = {
  get: async () => {
    const response = await apiClient.get('/stats');
    return response.data;
  }
};

// Health check
export const healthCheck = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export default {
  projectApi,
  skillApi,
  testimonialApi,
  contactApi,
  statsApi,
  healthCheck
};