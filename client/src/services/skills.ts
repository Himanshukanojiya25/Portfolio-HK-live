import { api } from './api';

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
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
  // ✅ FIXED: Universal response handler
  getSkills: async (): Promise<Skill[]> => {
    try {
      console.log('🔧 [skillsAPI] Fetching skills...');
      
      const response = await api.get('/api/skills');
      console.log('📦 [skillsAPI] Raw response:', response);
      
      let skillsArray: Skill[] = [];
      
      // Case 1: Direct array response
      if (Array.isArray(response)) {
        console.log('✅ Case 1: Direct array');
        skillsArray = response;
      }
      // Case 2: { data: [...] }
      else if (response && typeof response === 'object' && 'data' in response) {
        const responseData = (response as any).data;
        console.log('📊 Checking response.data:', responseData);
        if (Array.isArray(responseData)) {
          console.log('✅ Case 2: response.data is array');
          skillsArray = responseData;
        }
      }
      // Case 3: { success: true, data: [...] }
      else if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        const resp = response as any;
        if (resp.success && Array.isArray(resp.data)) {
          console.log('✅ Case 3: response.success.data is array');
          skillsArray = resp.data;
        }
      }
      // Case 4: { skills: [...] }
      else if (response && typeof response === 'object' && 'skills' in response) {
        const respSkills = (response as any).skills;
        if (Array.isArray(respSkills)) {
          console.log('✅ Case 4: response.skills is array');
          skillsArray = respSkills;
        }
      }
      // Case 5: { result: [...] }
      else if (response && typeof response === 'object' && 'result' in response) {
        const respResult = (response as any).result;
        if (Array.isArray(respResult)) {
          console.log('✅ Case 5: response.result is array');
          skillsArray = respResult;
        }
      }
      // Case 6: Search for any array in object
      else if (response && typeof response === 'object') {
        console.log('🔍 Searching for array in response object...');
        const respObj = response as Record<string, any>;
        const keys = Object.keys(respObj);
        
        for (const key of keys) {
          const value = respObj[key];
          if (Array.isArray(value) && value.length > 0 && value[0]?.name) {
            console.log(`✅ Found skills array in property "${key}"`);
            skillsArray = value;
            break;
          }
        }
      }
      
      // Final validation
      if (!Array.isArray(skillsArray)) {
        console.error('❌ Could not extract skills array from response');
        console.error('Response:', response);
        skillsArray = [];
      }
      
      console.log(`✅ [skillsAPI] Returning ${skillsArray.length} skills`);
      return skillsArray;
      
    } catch (error) {
      console.error('❌ [skillsAPI] Error fetching skills:', error);
      return [];
    }
  },

  // Get skills by category
  getSkillsByCategory: async (): Promise<Record<string, Skill[]>> => {
    try {
      const response = await api.get('/api/skills/categories');
      
      if (response && typeof response === 'object' && !Array.isArray(response)) {
        return response as Record<string, Skill[]>;
      }
      
      return {};
    } catch (error) {
      console.error('Error fetching skills by category:', error);
      return {};
    }
  },

  // Get single skill
  getSkill: async (id: string): Promise<Skill | null> => {
    try {
      const response = await api.get(`/api/skills/${id}`);
      
      if (response && typeof response === 'object') {
        const resp = response as any;
        if (resp.data) return resp.data;
        if (resp.success && resp.data) return resp.data;
        return response as Skill;
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching skill ${id}:`, error);
      return null;
    }
  },

  // Create skill
  createSkill: async (data: CreateSkillData): Promise<Skill | null> => {
  try {
    console.log('📤 Creating skill:', data);
    
    // Convert level percentage to enum string
    const getLevelEnum = (level: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' => {
      if (level <= 30) return 'beginner';
      if (level <= 60) return 'intermediate';
      if (level <= 85) return 'advanced';
      return 'expert';
    };
    
    const skillData = {
      name: data.name,
      category: data.category,
      level: getLevelEnum(data.level), // Convert to enum string
      icon: data.icon,
      color: data.color,
      isFeatured: data.featured,
      displayOrder: data.order,
      yearsOfExperience: 0,
      description: '',
      isActive: true
    };
    
    console.log('📦 Transformed data for backend:', skillData);
    
    const response = await api.post('/api/skills', skillData);
    console.log('📥 Create response:', response);
    
    // Handle response...
    return response as any;
  } catch (error) {
    console.error('Error creating skill:', error);
    return null;
  }
},

  // Update skill
  updateSkill: async (id: string, data: Partial<CreateSkillData>): Promise<Skill | null> => {
    try {
      const response = await api.put(`/api/skills/${id}`, data);
      
      if (response && typeof response === 'object') {
        const resp = response as any;
        if (resp.data) return resp.data;
        if (resp.success && resp.data) return resp.data;
        return response as Skill;
      }
      
      return null;
    } catch (error) {
      console.error(`Error updating skill ${id}:`, error);
      return null;
    }
  },

  // Delete skill
  deleteSkill: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/api/skills/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting skill ${id}:`, error);
      return false;
    }
  },

  // Reorder skills
  reorderSkills: async (skillIds: string[]): Promise<boolean> => {
    try {
      await api.put('/api/skills/reorder', { skillIds });
      return true;
    } catch (error) {
      console.error('Error reordering skills:', error);
      return false;
    }
  },

  // Get skill statistics
  getSkillStats: async (): Promise<SkillStats | null> => {
    try {
      const response = await api.get('/api/skills/stats');
      
      if (response && typeof response === 'object') {
        const resp = response as any;
        if (resp.data) return resp.data;
        if (resp.success && resp.data) return resp.data;
        return response as SkillStats;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching skill stats:', error);
      return null;
    }
  },

  // Get skill categories
  getSkillCategories: async (): Promise<SkillCategory[]> => {
    try {
      const response = await api.get('/api/skills/categories/stats');
      
      if (response && Array.isArray(response)) {
        return response;
      }
      
      if (response && typeof response === 'object') {
        const resp = response as any;
        if (Array.isArray(resp.data)) return resp.data;
        if (resp.success && Array.isArray(resp.data)) return resp.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching skill categories:', error);
      return [];
    }
  },

  // Toggle skill featured status
  toggleFeatured: async (id: string): Promise<Skill | null> => {
    try {
      const response = await api.patch(`/api/skills/${id}/featured`);
      
      if (response && typeof response === 'object') {
        const resp = response as any;
        if (resp.data) return resp.data;
        if (resp.success && resp.data) return resp.data;
        return response as Skill;
      }
      
      return null;
    } catch (error) {
      console.error(`Error toggling featured status for skill ${id}:`, error);
      return null;
    }
  },

  // Update skill order
  updateSkillOrder: async (skills: { id: string; order: number }[]): Promise<boolean> => {
    try {
      await api.patch('/api/skills/order', { skills });
      return true;
    } catch (error) {
      console.error('Error updating skill order:', error);
      return false;
    }
  },

  // Bulk update skills
  bulkUpdateSkills: async (updates: { id: string; data: Partial<CreateSkillData> }[]): Promise<boolean> => {
    try {
      await api.patch('/api/skills/bulk-update', { updates });
      return true;
    } catch (error) {
      console.error('Error bulk updating skills:', error);
      return false;
    }
  }
};

export default skillsAPI;