import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminAPI } from '@/services/admin';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string; // ✅ Add role
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
        currentPath: window.location.pathname
      });

      // 🔴 CRITICAL FIX: Agar token nahi hai to DIRECT clear
      if (!token) {
        console.log('🚫 No token found - Clearing any existing data');
        clearStorage();
        setIsLoading(false);
        return;
      }

      console.log('🔐 Attempting backend verification...');
      
      try {
        // ✅ MUST VERIFY WITH BACKEND - NO CACHE ALLOWED
        const response = await adminAPI.getProfile();
        console.log('📡 Backend Response:', response.data);
        
        if (response.data.success && response.data.data?.user) {
          const userFromBackend = response.data.data.user;
          console.log('✅ Backend auth SUCCESS - User:', userFromBackend.email);
          setUser(userFromBackend);
        } else {
          console.log('❌ Invalid backend response - Clearing storage');
          clearStorage();
        }
      } catch (error: any) {
        console.error('❌ Backend verification FAILED:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
        
        // 🔴 CRITICAL: Network error = LOGOUT
        console.log('🌐 Network/Server error - FORCE LOGOUT');
        clearStorage();
        
        // Optional: Show error message
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log('🔐 Token invalid/expired according to server');
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
      
      const { user: userData, token } = response.data.data;
      
      if (!token) {
        throw new Error('No token received');
      }

      // Save to storage
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      
      console.log('✅ Login SUCCESSFUL');
    } catch (error: any) {
      console.error('❌ Login FAILED:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('🔐 Manual logout triggered');
    clearStorage();
    // Optional: Call backend logout
    // adminAPI.logout().catch(() => {});
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