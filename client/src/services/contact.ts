import { api } from './api';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
  };
}

export const contactAPI = {
  sendMessage: async (data: ContactFormData): Promise<{ data: ContactResponse }> => {
    const response = await api.post('/api/contact', data);
    return response;
  },

  getMessages: async (): Promise<{ data: any[] }> => {
    const response = await api.get('/api/admin/contact-messages');
    return response;
  },

  deleteMessage: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/contact-messages/${id}`);
  },
};