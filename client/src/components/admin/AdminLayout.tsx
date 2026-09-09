import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Code2,
  BarChart3,
  Star,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { logout, user, isLoading } = useAuth();

  // ✅ COMPLETE AUTHENTICATION CHECK + REDIRECT
  useEffect(() => {
    console.log('🛡️ AdminLayout Auth Check:', {
      isLoading,
      hasUser: !!user,
      location
    });

    // Redirect /admin to /admin/dashboard
    if (location === '/admin') {
      console.log('↪️ Redirecting /admin to /admin/dashboard');
      setLocation('/admin/dashboard');
      return;
    }

    // If loading is done and no user, redirect to login
    // But only for admin routes (not login page itself)
    if (!isLoading && !user && location.startsWith('/admin') && location !== '/admin/login') {
      console.log('🚫 No authenticated user, redirecting to login');
      setLocation('/admin/login');
    }
  }, [user, isLoading, location, setLocation]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Checking authentication...</p>
          <p className="text-slate-400 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  // ✅ DON'T RENDER LAYOUT FOR NON-AUTHENTICATED USERS
  // Important: This runs after isLoading is false
  if (!user) {
    console.log('👤 No user found, not rendering layout');
    // Return null or a loading indicator
    // The useEffect above will handle redirect to login
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Navigation items - WITHOUT Messages
  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
    { name: 'Skills', href: '/admin/skills', icon: Code2 },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
  ];

  const handleLogout = () => {
    console.log('👋 User logging out');
    logout();
    setLocation('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-xl shadow-2xl border-r border-slate-700/30 transform transition-all duration-300 ease-in-out",
        "lg:translate-x-0 lg:static lg:inset-0",
        isSidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/30">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin </h1>
                <p className="text-slate-400 text-sm">Portfolio Manager</p>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-700/50 transition-all duration-200"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setLocation(item.href);
                    setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group relative overflow-hidden",
                    isActive 
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:shadow-lg"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                      : "bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/50 group-hover:text-white"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">{item.name}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User & Logout Section */}
          <div className="p-4 border-t border-slate-700/30 space-y-3">
            {/* User Info */}
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/50">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-slate-400 text-xs truncate">
                  {user?.email || 'admin@example.com'}
                </p>
              </div>
            </div>

            {/* Home & Logout Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => setLocation('/')}
                variant="outline"
                className="flex items-center space-x-2 text-slate-300 hover:text-white border-slate-600 hover:border-slate-500 bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200"
                size="sm"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center space-x-2 text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-400/50 bg-red-500/10 hover:bg-red-500/20 transition-all duration-200"
                size="sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/30 sticky top-0 z-40">
          <div className="flex items-center justify-between p-4 lg:p-6">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-700/50 transition-all duration-200"
            >
              <Menu className="w-6 h-6 text-slate-300" />
            </button>
            
            {/* Page Title */}
            <div className="flex-1 lg:flex-none lg:pl-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {navigation.find(item => item.href === location)?.name || 'Dashboard'}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Welcome back, {user?.name || 'Admin'}! 👋
              </p>
            </div>

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="text-right">
                <p className="text-slate-300 text-sm">Status</p>
                <p className="text-green-400 text-sm font-medium">● Online</p>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto bg-gradient-to-br from-slate-900/50 to-slate-950/50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;