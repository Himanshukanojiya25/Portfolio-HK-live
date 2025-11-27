import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminAPI } from '@/services/admin';

interface User {
  id: string;
  email: string;
  name: string;
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
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const userData = localStorage.getItem('admin_user');
      
      console.log('🔐 Auth Check - Storage:', {
        hasToken: !!token,
        hasUserData: !!userData
      });

      if (token && userData) {
        try {
          // ✅ Verify token with backend
          console.log('🔐 Verifying token with backend...');
          const response = await adminAPI.getProfile();
          
          console.log('✅ Token valid, user:', response.data);
          // ✅ FIX: Access user from response.data.data.user
          setUser(response.data.data.user);
        } catch (error) {
          console.error('❌ Token verification failed:', error);
          // Token invalid, clear storage
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setUser(null);
        }
      } else {
        console.log('❌ No token or user data found');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Login attempt:', email);
      
      const response = await adminAPI.login(email, password);
      
      console.log('🔍 Login Response:', response.data);
      
      // ✅ FIX: Access data from response.data.data (backend structure)
      const { user: userData, token } = response.data.data;
      
      console.log('✅ Login successful:', {
        user: userData.email,
        tokenLength: token?.length
      });

      // ✅ Save to localStorage
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(userData));
      
      // ✅ Set user state
      setUser(userData);
      
      console.log('✅ Token saved to localStorage');
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      console.log('🔍 Error details:', {
        response: error.response?.data,
        message: error.message
      });
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    console.log('🔐 Logging out...');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
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