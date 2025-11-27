import { api } from './api';

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  avatar?: string;
  content: string;
  rating: number; // 1-5
  featured: boolean;
  approved: boolean;
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
  featured: boolean;
  approved: boolean;
}

export const testimonialsAPI = {
  // Get all testimonials
  getTestimonials: async (): Promise<{ data: Testimonial[] }> => {
    const response = await api.get('/api/admin/testimonials');
    return response;
  },

  // Get approved testimonials
  getApprovedTestimonials: async (): Promise<{ data: Testimonial[] }> => {
    const response = await api.get('/api/testimonials');
    return response;
  },

  // Create testimonial
  createTestimonial: async (data: CreateTestimonialData): Promise<{ data: Testimonial }> => {
    const response = await api.post('/api/admin/testimonials', data);
    return response;
  },

  // Update testimonial
  updateTestimonial: async (id: string, data: Partial<CreateTestimonialData>): Promise<{ data: Testimonial }> => {
    const response = await api.put(`/api/admin/testimonials/${id}`, data);
    return response;
  },

  // Delete testimonial
  deleteTestimonial: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/testimonials/${id}`);
  },

  // Approve testimonial
  approveTestimonial: async (id: string): Promise<{ data: Testimonial }> => {
    const response = await api.patch(`/api/admin/testimonials/${id}/approve`);
    return response;
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<{ data: { url: string } }> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/api/admin/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
};