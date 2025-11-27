import { api } from './api';

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number; // 1-100
  icon?: string;
  color: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSkillData {
  name: string;
  category: string;
  level: number;
  icon?: string;
  color: string;
  featured: boolean;
  order: number;
}

export interface SkillStats {
  totalSkills: number;
  featuredSkills: number;
  categories: number;
  averageLevel: number;
}

export interface SkillCategory {
  category: string;
  count: number;
  averageLevel: number;
}

export const skillsAPI = {
  // Get all skills
  getSkills: async (): Promise<{ data: Skill[] }> => {
    const response = await api.get('/api/admin/skills');
    return response;
  },

  // Get skills by category
  getSkillsByCategory: async (): Promise<{ data: Record<string, Skill[]> }> => {
    const response = await api.get('/api/admin/skills/categories');
    return response;
  },

  // Get single skill
  getSkill: async (id: string): Promise<{ data: Skill }> => {
    const response = await api.get(`/api/admin/skills/${id}`);
    return response;
  },

  // Create skill
  createSkill: async (data: CreateSkillData): Promise<{ data: Skill }> => {
    const response = await api.post('/api/admin/skills', data);
    return response;
  },

  // Update skill
  updateSkill: async (id: string, data: Partial<CreateSkillData>): Promise<{ data: Skill }> => {
    const response = await api.put(`/api/admin/skills/${id}`, data);
    return response;
  },

  // Delete skill
  deleteSkill: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/skills/${id}`);
  },

  // Reorder skills
  reorderSkills: async (skillIds: string[]): Promise<void> => {
    await api.put('/api/admin/skills/reorder', { skillIds });
  },

  // Get skill statistics
  getSkillStats: async (): Promise<{ data: SkillStats }> => {
    const response = await api.get('/api/admin/skills/stats');
    return response;
  },

  // Get skill categories
  getSkillCategories: async (): Promise<{ data: SkillCategory[] }> => {
    const response = await api.get('/api/admin/skills/categories/stats');
    return response;
  },

  // Toggle skill featured status
  toggleFeatured: async (id: string): Promise<{ data: Skill }> => {
    const response = await api.patch(`/api/admin/skills/${id}/featured`);
    return response;
  },

  // Update skill order
  updateSkillOrder: async (skills: { id: string; order: number }[]): Promise<void> => {
    await api.patch('/api/admin/skills/order', { skills });
  },

  // Bulk update skills
  bulkUpdateSkills: async (updates: { id: string; data: Partial<CreateSkillData> }[]): Promise<void> => {
    await api.patch('/api/admin/skills/bulk-update', { updates });
  }
};

export default skillsAPI;