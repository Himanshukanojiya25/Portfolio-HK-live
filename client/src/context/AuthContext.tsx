import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminAPI } from '@/services/admin';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthProvider mounted - Starting auth check');
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log('🔐 ========== AUTH CHECK STARTED ==========');
    console.log('⏰ Time:', new Date().toLocaleTimeString());

    try {
      const token = localStorage.getItem('admin_token');
      const userData = localStorage.getItem('admin_user');

      console.log('📦 Storage Status:', {
        token: token ? `✅ Present (${token.length} chars)` : '❌ Absent',
        userData: userData ? '✅ Present' : '❌ Absent',
        currentPath: window.location.pathname,
      });

      // No token → clear & stop
      if (!token) {
        console.log('🚫 No token found - Clearing any existing data');
        clearStorage();
        setIsLoading(false);
        return;
      }

      // ✅ OPTIMISTIC: Pehle localStorage se user set karo (fast UI)
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          // Ensure role always exists
          if (!parsedUser.role) parsedUser.role = 'admin';
          console.log('⚡ Optimistic user set from storage:', parsedUser.email);
          setUser(parsedUser);
        } catch (e) {
          console.warn('⚠️ Could not parse admin_user from storage');
        }
      }

      console.log('🔐 Attempting backend verification...');

      try {
        const response = await adminAPI.getProfile();
        console.log('📡 Backend Response:', response.data);

        if (response.data.success && response.data.data?.user) {
          const userFromBackend = response.data.data.user;

          // ✅ Ensure role always set
          if (!userFromBackend.role) userFromBackend.role = 'admin';

          console.log('✅ Backend auth SUCCESS - User:', userFromBackend.email);
          setUser(userFromBackend);

          // Sync updated user to storage
          localStorage.setItem('admin_user', JSON.stringify(userFromBackend));
        } else {
          console.log('❌ Invalid backend response - Clearing storage');
          clearStorage();
        }
      } catch (error: any) {
        console.error('❌ Backend verification FAILED:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });

        // 🔴 Only clear on 401/403 — NOT on network errors
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log('🔐 Token invalid/expired according to server');
          clearStorage();
        } else {
          // Network error → keep user logged in from storage
          console.log('🌐 Network error - Keeping optimistic session');
          // Optional: retry logic here
        }
      }
    } catch (error) {
      console.error('💥 Auth check CRASHED:', error);
      clearStorage();
    } finally {
      console.log('✅ Auth check completed');
      setIsLoading(false);
    }
  };

  const clearStorage = () => {
    console.log('🧹 Clearing storage...');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  const login = async (email: string, password: string) => {
    console.log('🔐 Login attempt for:', email);

    try {
      const response = await adminAPI.login(email, password);
      console.log('📡 Login response:', response.data);

      // ✅ Flexible response parsing
      const payload = response.data?.data || response.data;
      const userData = payload.user;
      const token = payload.token || payload.accessToken;

      if (!token) {
        throw new Error('No token received from server');
      }

      if (!userData) {
        throw new Error('No user data received from server');
      }

      // ✅ Ensure role is always set
      const userWithRole: User = {
        ...userData,
        role: userData.role || 'admin',
      };

      // Save to storage
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(userWithRole));

      // Update state
      setUser(userWithRole);

      console.log('✅ Login SUCCESSFUL for:', userWithRole.email);
    } catch (error: any) {
      console.error('❌ Login FAILED:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('🔐 Manual logout triggered');
    clearStorage();
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};