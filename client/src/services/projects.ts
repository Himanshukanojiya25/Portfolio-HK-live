import { api } from './api';

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  links: {
    demo: string;
    github: string;
  };
  gradient: string;
  image?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  title: string;
  category: string;
  description: string;
  tech: string[];
  links: {
    demo: string;
    github: string;
  };
  gradient: string;
  image?: string;
  featured: boolean;
}

export interface ProjectStats {
  totalProjects: number;
  publishedProjects: number;
  featuredProjects: number;
  technologies: number;
  liveDemos: number;
}

export const projectsAPI = {
  // Get all projects
  getProjects: async (): Promise<{ data: Project[] }> => {
    const response = await api.get('/api/admin/projects');
    return response;
  },

  // Get single project
  getProject: async (id: string): Promise<{ data: Project }> => {
    const response = await api.get(`/api/admin/projects/${id}`);
    return response;
  },

  // Create project
  createProject: async (data: CreateProjectData): Promise<{ data: Project }> => {
    const response = await api.post('/api/admin/projects', data);
    return response;
  },

  // Update project
  updateProject: async (id: string, data: Partial<CreateProjectData>): Promise<{ data: Project }> => {
    const response = await api.put(`/api/admin/projects/${id}`, data);
    return response;
  },

  // Delete project
  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/projects/${id}`);
  },

  // Upload project image
  uploadImage: async (file: File): Promise<{ data: { url: string } }> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/api/admin/upload/project', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Get project statistics
  getProjectStats: async (): Promise<{ data: ProjectStats }> => {
    const response = await api.get('/api/admin/projects/stats');
    return response;
  },

  // Toggle project featured status
  toggleFeatured: async (id: string): Promise<{ data: Project }> => {
    const response = await api.patch(`/api/admin/projects/${id}/featured`);
    return response;
  },

  // Toggle project visibility
  toggleVisibility: async (id: string): Promise<{ data: Project }> => {
    const response = await api.patch(`/api/admin/projects/${id}/visibility`);
    return response;
  },

  // Update project order
  updateProjectOrder: async (projects: { id: string; displayOrder: number }[]): Promise<void> => {
    await api.patch('/api/admin/projects/order', { projects });
  }
};

export default projectsAPI;