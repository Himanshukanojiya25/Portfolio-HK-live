import axios from 'axios';


// =========================================================
// API BASE URL
// =========================================================

const API_BASE =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';


// =========================================================
// AXIOS CLIENT
// =========================================================

const apiClient = axios.create({

  baseURL: API_BASE,

  timeout: 10000,

  headers: {
    'Content-Type': 'application/json'
  },

  withCredentials: true

});


// =========================================================
// RESPONSE INTERCEPTOR
// =========================================================

apiClient.interceptors.response.use(

  (response) => {

    console.log('✅ [PUBLIC API] Success:', {
      url: response.config.url,
      status: response.status
    });

    return response;

  },

  (error) => {

    console.error('❌ [PUBLIC API] Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      response: error.response?.data
    });

    return Promise.reject(error);

  }

);


// =========================================================
// PROJECT TYPE
// =========================================================

export interface Project {

  _id: string;

  title: string;

  description: string;

  shortDescription: string;

  category: string;

  status: string;

  priority?: string;

  techStack: string[];

  technologies?: any[];

  featuredImage: string;

  images?: string[];

  liveUrl?: string;

  repositoryUrl?: string;

  documentationUrl?: string;

  videoUrl?: string;

  startDate: string;

  endDate?: string;

  current?: boolean;

  teamSize?: number;

  teamMembers?: string[];

  client?: string;

  features?: string[];

  challenges?: string[];

  solutions?: string[];

  learnings?: string[];

  viewCount?: number;

  likeCount?: number;

  downloadCount?: number;

  isPublic: boolean;

  isFeatured: boolean;

  displayOrder: number;

  createdAt: string;

  updatedAt: string;
}


// =========================================================
// PROJECT API RESPONSE TYPES
// =========================================================

interface ProjectsResponse {

  success: boolean;

  data: Project[];

  pagination: {

    page: number;

    limit: number;

    total: number;

    pages: number;

  };

}


interface SingleProjectResponse {

  success: boolean;

  data: Project;

}


// =========================================================
// PROJECT API
// =========================================================

export const projectApi = {

  // -------------------------------------------------------
  // GET ALL PUBLIC PROJECTS
  // GET /projects
  // -------------------------------------------------------

  getAll: async (
    params?: {
      category?: string;
      featured?: boolean;
      limit?: number;
    }
  ): Promise<ProjectsResponse> => {

    console.log(
      '🔍 [PUBLIC] Fetching all projects:',
      params
    );

    const response =
      await apiClient.get<ProjectsResponse>(
        '/projects',
        {
          params
        }
      );

    console.log(
      '📦 [PUBLIC] Projects response:',
      response.data
    );

    return response.data;
  },


  // -------------------------------------------------------
  // GET PROJECT BY ID
  // GET /projects/:id
  // -------------------------------------------------------

  getById: async (
    id: string
  ): Promise<SingleProjectResponse> => {

    console.log(
      `🔍 [PUBLIC] Fetching project: ${id}`
    );

    const response =
      await apiClient.get<SingleProjectResponse>(
        `/projects/${id}`
      );

    console.log(
      '📦 [PUBLIC] Project response:',
      response.data
    );

    return response.data;
  },


  // -------------------------------------------------------
  // GET FEATURED PROJECTS
  // GET /projects/featured
  // -------------------------------------------------------

  getFeatured: async (): Promise<ProjectsResponse> => {

    console.log(
      '⭐ [PUBLIC] Fetching featured projects'
    );

    const response =
      await apiClient.get<ProjectsResponse>(
        '/projects/featured'
      );

    return response.data;
  },


  // -------------------------------------------------------
  // GET PROJECTS BY TECHNOLOGY
  // GET /projects/tech/:tech
  // -------------------------------------------------------

  getByTech: async (
    tech: string
  ): Promise<ProjectsResponse> => {

    console.log(
      `🔍 [PUBLIC] Fetching projects by tech: ${tech}`
    );

    const response =
      await apiClient.get<ProjectsResponse>(
        `/projects/tech/${encodeURIComponent(tech)}`
      );

    return response.data;
  },


  // -------------------------------------------------------
  // LIKE PROJECT
  // -------------------------------------------------------

  like: async (
    id: string
  ) => {

    console.log(
      `❤️ [PUBLIC] Liking project: ${id}`
    );

    const response =
      await apiClient.patch(
        `/projects/${id}/like`
      );

    return response.data;
  }

};


// =========================================================
// SKILLS API
// =========================================================

export const skillApi = {

  getAll: async () => {

    console.log(
      '🔍 [PUBLIC] Fetching all skills'
    );

    const response =
      await apiClient.get('/skills');

    return response.data;
  },


  getByCategory: async (
    category: string
  ) => {

    console.log(
      `🔍 [PUBLIC] Fetching skills: ${category}`
    );

    const response =
      await apiClient.get(
        `/skills/category/${category}`
      );

    return response.data;
  }

};


// =========================================================
// TESTIMONIAL API
// =========================================================

export const testimonialApi = {

  getAll: async () => {

    console.log(
      '🔍 [PUBLIC] Fetching testimonials'
    );

    const response =
      await apiClient.get('/testimonials');

    return response.data;
  },


  getFeatured: async () => {

    console.log(
      '⭐ [PUBLIC] Fetching featured testimonials'
    );

    const response =
      await apiClient.get(
        '/testimonials/featured'
      );

    return response.data;
  }

};


// =========================================================
// CONTACT API
// =========================================================

export const contactApi = {

  submit: async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {

    console.log(
      '📧 [PUBLIC] Submitting contact form'
    );

    const response =
      await apiClient.post(
        '/contact',
        data
      );

    return response.data;
  }

};


// =========================================================
// STATS API
// =========================================================

export const statsApi = {

  get: async () => {

    console.log(
      '📊 [PUBLIC] Fetching stats'
    );

    const response =
      await apiClient.get('/stats');

    return response.data;
  }

};


// =========================================================
// HEALTH CHECK
// =========================================================

export const healthCheck = async () => {

  console.log(
    '🏥 [PUBLIC] Health check'
  );

  const response =
    await apiClient.get('/health');

  return response.data;
};


// =========================================================
// DEFAULT EXPORT
// =========================================================

export default {

  projectApi,

  skillApi,

  testimonialApi,

  contactApi,

  statsApi,

  healthCheck

};