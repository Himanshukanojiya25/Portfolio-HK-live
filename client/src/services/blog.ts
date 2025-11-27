import { api } from './api';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  tags: string[];
  category: string;
  published: boolean;
  featured: boolean;
  readingTime: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface CreateBlogPostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  tags: string[];
  category: string;
  published: boolean;
  featured: boolean;
}

export const blogAPI = {
  // Get all blog posts
  getPosts: async (): Promise<{ data: BlogPost[] }> => {
    const response = await api.get('/api/admin/blog');
    return response;
  },

  // Get single post
  getPost: async (id: string): Promise<{ data: BlogPost }> => {
    const response = await api.get(`/api/admin/blog/${id}`);
    return response;
  },

  // Create post
  createPost: async (data: CreateBlogPostData): Promise<{ data: BlogPost }> => {
    const response = await api.post('/api/admin/blog', data);
    return response;
  },

  // Update post
  updatePost: async (id: string, data: Partial<CreateBlogPostData>): Promise<{ data: BlogPost }> => {
    const response = await api.put(`/api/admin/blog/${id}`, data);
    return response;
  },

  // Delete post
  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/blog/${id}`);
  },

  // Upload cover image
  uploadCoverImage: async (file: File): Promise<{ data: { url: string } }> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/api/admin/upload/blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Update post status
  updatePostStatus: async (id: string, published: boolean): Promise<{ data: BlogPost }> => {
    const response = await api.patch(`/api/admin/blog/${id}/status`, { published });
    return response;
  },
};