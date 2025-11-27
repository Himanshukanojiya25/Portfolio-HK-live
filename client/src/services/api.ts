import axios, { InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('🌐 API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ✅ FIXED: Simplified and improved request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      // ✅ FIX: Only check admin_token (consistent with AuthContext)
      const token = localStorage.getItem('admin_token');

      console.log('🔐 Token Check:', {
        hasToken: !!token,
        tokenLength: token?.length,
        endpoint: config.url?.split('/').pop() // Show only endpoint name
      });
      
      if (token && token !== 'null' && token !== 'undefined') {
        // ✅ FIX: Use ONLY Bearer token (remove backup headers to avoid confusion)
        config.headers.Authorization = `Bearer ${token}`;
        
        console.log('✅ Token added to Authorization header');
      } else {
        console.log('❌ No valid admin_token found');
        // Clean up any existing auth headers
        delete config.headers.Authorization;
        delete config.headers['x-auth-token'];
      }
    } catch (error) {
      console.error('❌ Request interceptor error:', error);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor failed:', error);
    return Promise.reject(error);
  }
);

// ✅ FIXED: Improved response interceptor with better logging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', {
      url: response.config.url,
      status: response.status,
      data: response.data ? 'Response received' : 'No data'
    });
    return response;
  },
  (error) => {
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      endpoint: error.config?.url?.split('/').pop()
    };

    console.error('❌ API Error:', errorDetails);

    // Handle specific error cases
    if (error.response?.status === 401) {
      console.log('🔐 401 Unauthorized - Token invalid or expired');
      
      // ✅ FIX: Only clear admin_token (don't clear other tokens)
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      
      console.log('🗑️ Cleared admin auth data from localStorage');
      
      // Redirect to login if not already there
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/admin/login')) {
        console.log('🔄 Redirecting to login page...');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
      }
    } 
    else if (error.response?.status === 500) {
      console.error('🚨 Server Error - Please check backend logs');
    } 
    else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
      console.error('🌐 Network Error - Backend server might be down');
      console.log('💡 Please ensure backend is running on:', API_BASE_URL);
    }
    else if (error.response?.status === 404) {
      console.error('🔍 Endpoint not found - Check API route');
    }

    return Promise.reject(error);
  }
);

// ✅ IMPROVED: Utility function to check auth status
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    
    console.log('🔐 Auth Status Check:', {
      hasToken: !!token,
      hasUserData: !!userData
    });

    if (!token) {
      console.log('❌ No token found');
      return false;
    }

    // Simple token validation (basic format check)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('❌ Invalid token format');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      return false;
    }

    console.log('✅ Token format valid');
    return true;
  } catch (error) {
    console.error('❌ Auth status check failed:', error);
    return false;
  }
};

// ✅ NEW: Function to manually set token (for debugging)
export const setAuthToken = (token: string) => {
  if (token && token !== 'null' && token !== 'undefined') {
    localStorage.setItem('admin_token', token);
    console.log('🔐 Manual token set:', token.substring(0, 20) + '...');
  }
};

// ✅ NEW: Function to clear auth data
export const clearAuthData = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  console.log('🗑️ All auth data cleared');
};

export default api;