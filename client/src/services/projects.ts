import { api } from './api';

export interface Project {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  techStack: string[];
  links: {
    demo: string;
    github: string;
  };
  featuredImage: string;
  isPublic: boolean;
  isFeatured: boolean;
  status: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  techStack: string[];
  featuredImage: string;
  images: string[];
  status: string;
  priority: string;
  liveUrl?: string;
  repositoryUrl?: string;
  documentationUrl?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  teamSize?: number;
  teamMembers?: string[];
  client?: string;
  features: string[];
  challenges: string[];
  solutions: string[];
  learnings: string[];
  isPublic: boolean;
  isFeatured: boolean;
  displayOrder: number;
  technologies?: string[];
}

export interface ProjectStats {
  totalProjects: number;
  publishedProjects: number;
  featuredProjects: number;
  technologies: number;
  liveDemos: number;
}

export const projectsAPI = {
  // Get all projects - ADMIN VIEW (shows all including non-public)
  getProjects: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    featured?: boolean;
    tech?: string;
  }): Promise<{ data: Project[]; pagination: any }> => {
    console.log('🔍 [ADMIN] Fetching projects with params:', params);
    
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    queryParams.append('admin', 'true');
    
    // ✅ FIX: Use /api/admin/projects instead of /api/projects
    const response = await api.get(`/api/admin/projects?${queryParams.toString()}`);
    console.log('✅ [ADMIN] Projects fetched:', {
      count: response.data.data?.length || 0,
      pagination: response.data.pagination
    });
    return {
      data: response.data.data || [],
      pagination: response.data.pagination || {}
    };
  },

  // Get single project - ADMIN VIEW
  getProject: async (id: string): Promise<{ data: Project }> => {
    console.log(`🔍 [ADMIN] Fetching project: ${id}`);
    
    // ✅ FIX: Use /api/admin/projects with admin=true
    const response = await api.get(`/api/admin/projects/${id}?admin=true`);
    console.log(`✅ [ADMIN] Project fetched: ${response.data.data?.title}`);
    return response;
  },

  // Create project
  createProject: async (data: CreateProjectData): Promise<{ data: Project }> => {
    console.log('🔨 [ADMIN] Creating project:', data.title);
    
    // ✅ FIX: Use /api/admin/projects
    const response = await api.post('/api/admin/projects', data);
    console.log(`✅ [ADMIN] Project created: ${response.data.data?.title}`);
    return response;
  },

  // Update project
  updateProject: async (id: string, data: Partial<CreateProjectData>): Promise<{ data: Project }> => {
    console.log(`✏️ [ADMIN] Updating project ${id}:`, data);
    
    // ✅ FIX: Use /api/admin/projects with admin=true
    const response = await api.put(`/api/admin/projects/${id}?admin=true`, data);
    console.log(`✅ [ADMIN] Project updated: ${response.data.data?.title}`);
    
    if (data.isPublic !== undefined) {
      console.log(`📢 [ADMIN] Project visibility changed to: ${data.isPublic ? 'PUBLIC' : 'PRIVATE'}`);
    }
    
    return response;
  },

  // Delete project
  deleteProject: async (id: string): Promise<void> => {
    console.log(`🗑️ [ADMIN] Deleting project: ${id}`);
    
    // ✅ FIX: Use /api/admin/projects with admin=true
    await api.delete(`/api/admin/projects/${id}?admin=true`);
    console.log(`✅ [ADMIN] Project deleted: ${id}`);
  },

  // Upload project image
  uploadImage: async (file: File): Promise<{ data: { url: string } }> => {
    console.log('📤 [ADMIN] Uploading project image:', file.name);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await api.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('✅ [ADMIN] Image uploaded:', response.data.url);
      return response;
    } catch (error) {
      console.error('❌ [ADMIN] Image upload failed, using fallback');
      return {
        data: {
          url: 'https://via.placeholder.com/600x400/3b82f6/ffffff?text=Project+Image'
        }
      };
    }
  },

  // Get project statistics
  getProjectStats: async (): Promise<{ data: ProjectStats }> => {
    console.log('📊 [ADMIN] Fetching project stats');
    
    try {
      const response = await api.get('/api/admin/dashboard/stats');
      console.log('✅ [ADMIN] Stats fetched:', response.data.data?.overview);
      
      const stats = response.data.data?.overview || {};
      return {
        data: {
          totalProjects: stats.totalProjects || 0,
          publishedProjects: stats.publishedProjects || 0,
          featuredProjects: stats.featuredProjects || 0,
          technologies: stats.totalSkills || 0,
          liveDemos: stats.liveDemos || 0
        }
      };
    } catch (error) {
      console.error('❌ [ADMIN] Stats fetch failed:', error);
      return {
        data: {
          totalProjects: 0,
          publishedProjects: 0,
          featuredProjects: 0,
          technologies: 0,
          liveDemos: 0
        }
      };
    }
  },

  // Toggle project featured status
  toggleFeatured: async (id: string): Promise<{ data: Project }> => {
    console.log(`⭐ [ADMIN] Toggling featured status for: ${id}`);
    
    // First get current project
    const current = await projectsAPI.getProject(id);
    const isCurrentlyFeatured = current.data.data?.isFeatured || false;
    
    // ✅ FIX: Use /api/admin/projects with admin=true
    const response = await api.put(`/api/admin/projects/${id}?admin=true`, {
      isFeatured: !isCurrentlyFeatured,
      isPublic: true
    });
    
    console.log(`✅ [ADMIN] Featured status toggled to: ${!isCurrentlyFeatured}`);
    return response;
  },

  // Toggle project visibility
  toggleVisibility: async (id: string): Promise<{ data: Project }> => {
    console.log(`👁️ [ADMIN] Toggling visibility for: ${id}`);
    
    const current = await projectsAPI.getProject(id);
    const isCurrentlyPublic = current.data.data?.isPublic || false;
    
    // ✅ FIX: Use /api/admin/projects with admin=true
    const response = await api.put(`/api/admin/projects/${id}?admin=true`, {
      isPublic: !isCurrentlyPublic
    });
    
    console.log(`✅ [ADMIN] Visibility toggled to: ${!isCurrentlyPublic ? 'PUBLIC' : 'PRIVATE'}`);
    return response;
  },

  // Update project order
  updateProjectOrder: async (projects: { id: string; displayOrder: number }[]): Promise<void> => {
    console.log('🔄 [ADMIN] Updating project order:', projects);
    
    const updates = projects.map(async (project) => {
      // ✅ FIX: Use /api/admin/projects with admin=true
      await api.put(`/api/admin/projects/${project.id}?admin=true`, {
        displayOrder: project.displayOrder
      });
    });
    
    await Promise.all(updates);
    console.log('✅ [ADMIN] Project order updated');
  },

  // Get public projects (for preview)
  getPublicProjects: async (): Promise<{ data: Project[] }> => {
    console.log('🔍 [ADMIN] Fetching public projects for preview');
    
    const response = await api.get('/api/public/projects');
    console.log(`✅ [ADMIN] Public projects fetched: ${response.data.data?.projects?.length || 0}`);
    return {
      data: response.data.data?.projects || []
    };
  }
};

export default projectsAPI;