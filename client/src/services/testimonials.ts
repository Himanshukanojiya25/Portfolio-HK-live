import { api } from './api';

export interface Testimonial {
  _id: string;
  id: string;
  name: string;
  position: string;
  company: string;
  avatar?: string;
  content: string;
  rating: number;
  featured: boolean;
  approved: boolean;
  isApproved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialData {
  name: string;
  position: string;
  company: string;
  avatar?: string;
  content: string;
  rating: number;
  featured?: boolean;
  approved?: boolean;
}

export const testimonialsAPI = {
  // Get all testimonials (admin only)
  getTestimonials: async (): Promise<Testimonial[]> => {
    try {
      console.log('📞 Calling API: /api/admin/testimonials');
      const response = await api.get('/api/admin/testimonials');
      console.log('✅ API Response received:', response.status);
      console.log('📦 Response data structure:', Object.keys(response.data));
      
      // Handle different response structures
      const testimonials = response.data?.data || 
                          response.data?.testimonials || 
                          response.data || 
                          [];
      
      console.log(`📊 Found ${testimonials.length} testimonials`);
      
      // Transform backend data to frontend format
      return testimonials.map((testimonial: any) => ({
        id: testimonial._id || testimonial.id || '',
        _id: testimonial._id || testimonial.id || '',
        name: testimonial.name || '',
        position: testimonial.role || testimonial.position || '',
        company: testimonial.company || '',
        avatar: testimonial.avatar || '',
        content: testimonial.content || '',
        rating: testimonial.rating || 5,
        featured: testimonial.featured || false,
        approved: testimonial.isApproved || testimonial.approved || false,
        isApproved: testimonial.isApproved || false,
        createdAt: testimonial.createdAt || new Date().toISOString(),
        updatedAt: testimonial.updatedAt || new Date().toISOString()
      }));
    } catch (error: any) {
      console.error('❌ Error fetching testimonials:', error.message);
      console.error('Error details:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data
      });
      return [];
    }
  },

  // Get approved testimonials (public)
  getApprovedTestimonials: async (): Promise<Testimonial[]> => {
    try {
      console.log('📞 Calling public API: /api/testimonials');
      const response = await api.get('/api/testimonials');
      
      const testimonials = response.data?.data || 
                          response.data?.testimonials || 
                          response.data || 
                          [];
      
      return testimonials.map((testimonial: any) => ({
        id: testimonial._id,
        _id: testimonial._id,
        name: testimonial.name,
        position: testimonial.role,
        company: testimonial.company,
        avatar: testimonial.avatar,
        content: testimonial.content,
        rating: testimonial.rating,
        featured: testimonial.featured,
        approved: testimonial.isApproved,
        isApproved: testimonial.isApproved,
        createdAt: testimonial.createdAt,
        updatedAt: testimonial.updatedAt
      }));
    } catch (error) {
      console.error('Error fetching approved testimonials:', error);
      return [];
    }
  },

  // Create new testimonial
  createTestimonial: async (data: CreateTestimonialData): Promise<Testimonial> => {
    try {
      console.log('📝 Creating testimonial with data:', data);
      
      const payload = {
        name: data.name,
        role: data.position, // Map position to role for backend
        company: data.company,
        avatar: data.avatar || '',
        content: data.content,
        rating: data.rating,
        featured: data.featured || false,
        isApproved: data.approved || false
      };
      
      console.log('📤 Sending payload:', payload);
      const response = await api.post('/api/admin/testimonials', payload);
      console.log('✅ Create response:', response.status);
      
      const testimonial = response.data.data || response.data;
      
      return {
        id: testimonial._id || testimonial.id,
        _id: testimonial._id || testimonial.id,
        name: testimonial.name,
        position: testimonial.role,
        company: testimonial.company,
        avatar: testimonial.avatar,
        content: testimonial.content,
        rating: testimonial.rating,
        featured: testimonial.featured,
        approved: testimonial.isApproved,
        isApproved: testimonial.isApproved,
        createdAt: testimonial.createdAt,
        updatedAt: testimonial.updatedAt
      };
    } catch (error: any) {
      console.error('❌ Error creating testimonial:', error.message);
      console.error('Error details:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  // Update testimonial
  updateTestimonial: async (id: string, data: Partial<CreateTestimonialData>): Promise<Testimonial> => {
    try {
      const updateData: any = {};
      
      // Map frontend fields to backend fields
      if (data.name !== undefined) updateData.name = data.name;
      if (data.position !== undefined) updateData.role = data.position;
      if (data.company !== undefined) updateData.company = data.company;
      if (data.avatar !== undefined) updateData.avatar = data.avatar;
      if (data.content !== undefined) updateData.content = data.content;
      if (data.rating !== undefined) updateData.rating = data.rating;
      if (data.featured !== undefined) updateData.featured = data.featured;
      if (data.approved !== undefined) updateData.isApproved = data.approved;
      
      console.log('🔄 Updating testimonial:', id, updateData);
      const response = await api.put(`/api/admin/testimonials/${id}`, updateData);
      
      const testimonial = response.data.data || response.data;
      
      return {
        id: testimonial._id,
        _id: testimonial._id,
        name: testimonial.name,
        position: testimonial.role,
        company: testimonial.company,
        avatar: testimonial.avatar,
        content: testimonial.content,
        rating: testimonial.rating,
        featured: testimonial.featured,
        approved: testimonial.isApproved,
        isApproved: testimonial.isApproved,
        createdAt: testimonial.createdAt,
        updatedAt: testimonial.updatedAt
      };
    } catch (error: any) {
      console.error('❌ Error updating testimonial:', error.message);
      throw error;
    }
  },

  // Delete testimonial
  deleteTestimonial: async (id: string): Promise<void> => {
    try {
      console.log('🗑️ Deleting testimonial:', id);
      await api.delete(`/api/admin/testimonials/${id}`);
      console.log('✅ Testimonial deleted successfully');
    } catch (error: any) {
      console.error('❌ Error deleting testimonial:', error.message);
      throw error;
    }
  },

  // Approve testimonial
  approveTestimonial: async (id: string): Promise<Testimonial> => {
    try {
      console.log('✅ Approving testimonial:', id);
      const response = await api.patch(`/api/admin/testimonials/${id}/approve`);
      
      const testimonial = response.data.data || response.data;
      
      return {
        id: testimonial._id,
        _id: testimonial._id,
        name: testimonial.name,
        position: testimonial.role,
        company: testimonial.company,
        avatar: testimonial.avatar,
        content: testimonial.content,
        rating: testimonial.rating,
        featured: testimonial.featured,
        approved: testimonial.isApproved,
        isApproved: testimonial.isApproved,
        createdAt: testimonial.createdAt,
        updatedAt: testimonial.updatedAt
      };
    } catch (error: any) {
      console.error('❌ Error approving testimonial:', error.message);
      throw error;
    }
  },

  // Feature/unfeature testimonial
  featureTestimonial: async (id: string, featured: boolean): Promise<Testimonial> => {
    try {
      console.log(`⭐ ${featured ? 'Featuring' : 'Unfeaturing'} testimonial:`, id);
      const response = await api.patch(`/api/admin/testimonials/${id}/feature`, { featured });
      
      const testimonial = response.data.data || response.data;
      
      return {
        id: testimonial._id,
        _id: testimonial._id,
        name: testimonial.name,
        position: testimonial.role,
        company: testimonial.company,
        avatar: testimonial.avatar,
        content: testimonial.content,
        rating: testimonial.rating,
        featured: testimonial.featured,
        approved: testimonial.isApproved,
        isApproved: testimonial.isApproved,
        createdAt: testimonial.createdAt,
        updatedAt: testimonial.updatedAt
      };
    } catch (error: any) {
      console.error('❌ Error featuring testimonial:', error.message);
      throw error;
    }
  },

  // Upload avatar (temporary mock implementation)
  uploadAvatar: async (file: File): Promise<{ url: string }> => {
    try {
      console.log('🖼️ Uploading avatar:', file.name, file.type);
      
      // For now, create a mock URL - replace with actual upload later
      const mockUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        file.name.split('.')[0]
      )}&background=6366f1&color=fff&size=150`;
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Avatar mock upload complete:', mockUrl);
      return { url: mockUrl };
      
      /* 
      // Actual implementation (when upload route is ready):
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post('/api/admin/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return { url: response.data.data?.url || response.data.url };
      */
    } catch (error: any) {
      console.error('❌ Error uploading avatar:', error.message);
      // Return fallback avatar
      return { url: 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff' };
    }
  }
};