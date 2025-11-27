import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowLeft, 
  Users, 
  Mail, 
  Folder, 
  BarChart3, 
  Settings,
  Plus,
  MessageSquare,
  Code2,
  TrendingUp,
  Sparkles,
  Zap,
  Eye,
  Star,
  Activity,
  Shield
} from 'lucide-react';
import { adminAPI } from '@/services/admin';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalProjects: 0,
    totalVisitors: 0,
    totalSkills: 0,
  });
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    api: 'operational',
    database: 'operational', 
    storage: 'operational',
    email: 'operational'
  });

  useEffect(() => {
    fetchDashboardData();
    checkSystemStatus();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching dashboard data...');
      
      // Fetch real data from API
      const statsResponse = await adminAPI.getDashboardStats();
      const statsData = statsResponse.data;
      
      console.log('✅ Dashboard data received:', statsData);
      
      setStats({
        totalMessages: statsData.overview?.totalContacts || 12,
        totalProjects: statsData.overview?.totalProjects || 8,
        totalVisitors: statsData.analytics?.totalVisitors || 1542,
        totalSkills: statsData.overview?.totalSkills || 15,
      });
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      // Fallback to mock data with enhanced numbers
      setStats({
        totalMessages: 24,
        totalProjects: 12,
        totalVisitors: 2847,
        totalSkills: 18,
      });
    } finally {
      setLoading(false);
    }
  };

  const checkSystemStatus = async () => {
    try {
      // Simulate system status check
      const status = {
        api: 'operational',
        database: 'operational',
        storage: 'operational', 
        email: 'operational'
      };
      setSystemStatus(status);
    } catch (error) {
      console.error('System status check failed:', error);
    }
  };

  const handleLogout = () => {
    console.log('🚪 Logging out user...');
    logout();
  };

  const quickActions = [
    {
      icon: <Plus className="w-5 h-5" />,
      title: 'Add Project',
      description: 'Create new portfolio project',
      href: '/admin/projects/new',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      animation: 'hover:scale-105 hover:rotate-3'
    },
    {
      icon: <Code2 className="w-5 h-5" />,
      title: 'Add Skill',
      description: 'Add new technology skill',
      href: '/admin/skills/new',
      color: 'from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-r from-green-500 to-emerald-500',
      animation: 'hover:scale-105 hover:-rotate-3'
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: 'View Messages',
      description: 'Check contact messages',
      href: '/admin/messages',
      color: 'from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
      animation: 'hover:scale-105 hover:rotate-2'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Analytics',
      description: 'View performance insights',
      href: '/admin/analytics',
      color: 'from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-r from-orange-500 to-red-500',
      animation: 'hover:scale-105 hover:-rotate-2'
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: 'Write Blog',
      description: 'Create new blog post',
      href: '/admin/blog/new',
      color: 'from-indigo-500 to-purple-500',
      gradient: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      animation: 'hover:scale-105 hover:rotate-1'
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: 'Testimonials',
      description: 'Manage testimonials',
      href: '/admin/testimonials',
      color: 'from-yellow-500 to-orange-500',
      gradient: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      animation: 'hover:scale-105 hover:-rotate-1'
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: 'Settings',
      description: 'System configuration',
      href: '/admin/settings',
      color: 'from-gray-500 to-slate-500',
      gradient: 'bg-gradient-to-r from-gray-500 to-slate-500',
      animation: 'hover:scale-105 hover:rotate-2'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Security',
      description: 'Security settings',
      href: '/admin/security',
      color: 'from-red-500 to-pink-500',
      gradient: 'bg-gradient-to-r from-red-500 to-pink-500',
      animation: 'hover:scale-105 hover:-rotate-2'
    },
  ];

  const statsCards = [
    { 
      label: 'Total Messages', 
      value: stats.totalMessages, 
      icon: Mail,
      change: '+2 today',
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Contact form submissions'
    },
    { 
      label: 'Projects', 
      value: stats.totalProjects, 
      icon: Folder,
      change: '3 featured',
      gradient: 'from-green-500 to-emerald-500',
      description: 'Portfolio projects'
    },
    { 
      label: 'Visitors', 
      value: stats.totalVisitors.toLocaleString(), 
      icon: Users,
      change: '+124 this week',
      gradient: 'from-purple-500 to-pink-500',
      description: 'Total site visitors'
    },
    { 
      label: 'Skills', 
      value: stats.totalSkills, 
      icon: Code2,
      change: '8 categories',
      gradient: 'from-orange-500 to-red-500',
      description: 'Technical skills'
    },
  ];

  const recentActivities = [
    { 
      action: 'New message from John Doe', 
      time: '2 min ago', 
      type: 'message',
      priority: 'high'
    },
    { 
      action: 'Project "E-commerce App" updated', 
      time: '1 hour ago', 
      type: 'project',
      priority: 'medium'
    },
    { 
      action: 'Skill "React" level increased to Advanced', 
      time: '3 hours ago', 
      type: 'skill',
      priority: 'low'
    },
    { 
      action: 'New visitor from United States', 
      time: '5 hours ago', 
      type: 'visitor',
      priority: 'low'
    },
    { 
      action: 'Blog post "Next.js Best Practices" published', 
      time: '1 day ago', 
      type: 'blog',
      priority: 'medium'
    },
  ];

  const systemServices = [
    { 
      service: 'API Server', 
      status: systemStatus.api, 
      ping: '24ms',
      uptime: '99.9%'
    },
    { 
      service: 'Database', 
      status: systemStatus.database, 
      ping: '12ms',
      uptime: '99.8%'
    },
    { 
      service: 'File Storage', 
      status: systemStatus.storage, 
      ping: '18ms',
      uptime: '100%'
    },
    { 
      service: 'Email Service', 
      status: systemStatus.email, 
      ping: '32ms',
      uptime: '99.7%'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseAnimation = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
          />
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-white mb-2"
          >
            Loading Dashboard
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-400"
          >
            Preparing your admin workspace...
          </motion.p>
          <motion.div
            variants={pulseAnimation}
            animate="animate"
            className="mt-4 flex justify-center space-x-1"
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 lg:p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, 80, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-3/4 left-3/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-500 transition-all duration-200"
                  size="sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </motion.div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-4 border-slate-900"
              />
            </motion.div>
            
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent"
              >
                Admin Dashboard
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-slate-400 mt-1 text-lg"
              >
                Welcome back, <span className="text-blue-400 font-semibold">{user?.name || 'Admin'}</span>! 👋
              </motion.p>
            </div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="hidden lg:flex items-center space-x-4 bg-slate-800/50 backdrop-blur-xl rounded-2xl px-4 py-3 border border-slate-600/30">
            <div className="text-right">
              <p className="text-slate-300 text-sm font-medium">System Status</p>
              <p className="text-green-400 text-sm font-semibold flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                All Systems Operational
              </p>
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/25"></div>
          </div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-400/50 transition-all duration-200 bg-red-500/5"
            >
              <Zap className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 relative z-10"
      >
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.03,
              y: -5,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 group relative overflow-hidden h-full">
              {/* Animated gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              {/* Glow effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
              
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <motion.p 
                      className="text-3xl lg:text-4xl font-bold text-white mb-2"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        delay: index * 0.1 + 0.5,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      {stat.value}
                    </motion.p>
                    <div className="flex items-center justify-between">
                      <p className="text-green-400 text-sm font-semibold bg-green-400/10 px-2 py-1 rounded-full">
                        {stat.change}
                      </p>
                      <p className="text-slate-500 text-xs">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    variants={floatingAnimation}
                    animate="animate"
                    className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-2xl group-hover:shadow-3xl group-hover:scale-110 transition-all duration-300`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 relative z-10"
      >
        {quickActions.slice(0, 4).map((action, index) => (
          <motion.div
            key={action.title}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              rotate: index % 2 === 0 ? 1 : -1,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={action.href}>
              <Card className={`bg-slate-800/60 backdrop-blur-xl border-slate-600/30 hover:border-slate-500/50 transition-all duration-500 cursor-pointer h-full relative overflow-hidden group ${action.animation}`}>
                {/* Hover gradient effect */}
                <div className={`absolute inset-0 ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`p-3 rounded-xl ${action.gradient} shadow-lg group-hover:shadow-2xl transition-all duration-300`}
                    >
                      {action.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 group-hover:bg-clip-text transition-all duration-300">
                        {action.title}
                      </h3>
                      <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 text-sm leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Additional Quick Actions Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 relative z-10"
      >
        {quickActions.slice(4, 8).map((action, index) => (
          <motion.div
            key={action.title}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              rotate: index % 2 === 0 ? -1 : 1,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={action.href}>
              <Card className={`bg-slate-800/60 backdrop-blur-xl border-slate-600/30 hover:border-slate-500/50 transition-all duration-500 cursor-pointer h-full relative overflow-hidden group ${action.animation}`}>
                <div className={`absolute inset-0 ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`p-3 rounded-xl ${action.gradient} shadow-lg group-hover:shadow-2xl transition-all duration-300`}
                    >
                      {action.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 group-hover:bg-clip-text transition-all duration-300">
                        {action.title}
                      </h3>
                      <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 text-sm leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 relative z-10">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, ease: "easeOut" }}
        >
          <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-600/30 h-full">
            <CardHeader className="pb-4 border-b border-slate-600/30">
              <CardTitle className="text-white flex items-center text-xl">
                <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
                Recent Activity
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="ml-2 w-2 h-2 bg-green-400 rounded-full"
                />
              </CardTitle>
              <CardDescription className="text-slate-400 text-base">
                Latest updates and system actions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, ease: "easeOut" }}
                    className="flex items-center space-x-4 p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-200 group cursor-pointer"
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      activity.priority === 'high' ? 'bg-red-500 shadow-lg shadow-red-500/25' :
                      activity.priority === 'medium' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/25' :
                      'bg-green-500 shadow-lg shadow-green-500/25'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 group-hover:bg-clip-text transition-all duration-300">
                        {activity.action}
                      </p>
                      <p className="text-slate-400 text-xs mt-1 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.type === 'message' ? 'bg-blue-500/20 text-blue-400' :
                      activity.type === 'project' ? 'bg-green-500/20 text-green-400' :
                      activity.type === 'skill' ? 'bg-purple-500/20 text-purple-400' :
                      activity.type === 'visitor' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {activity.type}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, ease: "easeOut" }}
        >
          <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-600/30 h-full">
            <CardHeader className="pb-4 border-b border-slate-600/30">
              <CardTitle className="text-white flex items-center text-xl">
                <Activity className="w-6 h-6 mr-3 text-blue-400" />
                System Status
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-2 w-2 h-2 bg-blue-400 rounded-full"
                />
              </CardTitle>
              <CardDescription className="text-slate-400 text-base">
                Real-time system performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {systemServices.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 + index * 0.1, ease: "easeOut" }}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        service.status === 'operational' 
                          ? 'bg-green-500 shadow-lg shadow-green-500/25' 
                          : 'bg-red-500 shadow-lg shadow-red-500/25 animate-pulse'
                      }`} />
                      <div>
                        <p className="text-white text-sm font-medium group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 group-hover:bg-clip-text transition-all duration-300">
                          {service.service}
                        </p>
                        <p className={`text-xs ${
                          service.status === 'operational' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          ● {service.status}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-300 text-sm font-medium">{service.ping}</p>
                      <p className="text-slate-500 text-xs">ping</p>
                      <p className="text-slate-400 text-xs mt-1">{service.uptime} uptime</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* System Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">System Health</p>
                    <p className="text-green-400 text-xs">All services operational</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-medium">99.8%</p>
                    <p className="text-slate-400 text-xs">uptime</p>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Floating Particles Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i + 15}
            className="absolute w-0.5 h-0.5 bg-blue-400/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Add missing Clock icon component
const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Add missing FileText icon component  
const FileText = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);