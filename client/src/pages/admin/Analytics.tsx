import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Eye, 
  MousePointer, 
  Clock,
  TrendingUp,
  Calendar,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Search,
  Filter,
  Download,
  RefreshCw,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  User,
  Cpu,
  HardDrive,
  Wifi,
  Shield,
  Target,
  Navigation,
  Zap,
  Loader2,
  Sparkles,
  Globe2,
  Smartphone as Phone,
  Laptop,
  Server,
  BarChart,
  TrendingDown,
  Percent,
  Clock4
} from 'lucide-react';
import { analyticsService, AnalyticsSummary, TimeSeriesData, TopPagesData, DeviceData, LocationData, RealTimeVisitor } from '@/services/analytics';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

// Recharts for charts
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar
} from 'recharts';

// Components
import VisitorMap from '@/components/analytics/VisitorMap';
import RealTimeVisitors from '@/components/analytics/RealTimeVisitors';
import EngagementChart from '@/components/analytics/EngagementChart';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data states
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([]);
  const [topPages, setTopPages] = useState<TopPagesData[]>([]);
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [realTimeVisitors, setRealTimeVisitors] = useState<RealTimeVisitor[]>([]);

  // Filters
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');

  // Color schemes matching your portfolio theme
  const COLORS = ['#a78bfa', '#22d3ee', '#34d399', '#fbbf24', '#f87171'];
  const GLOW_COLORS = {
    primary: 'rgba(252, 100, 68, 0.5)',
    secondary: 'rgba(34, 211, 238, 0.5)',
    success: 'rgba(34, 211, 238, 0.3)',
    warning: 'rgba(251, 191, 36, 0.3)'
  };

  const TIME_RANGES = [
    { value: '1d', label: 'Today', icon: Clock4 },
    { value: '7d', label: 'Last 7 days', icon: Calendar },
    { value: '30d', label: 'Last 30 days', icon: Calendar },
    { value: '90d', label: 'Last 90 days', icon: Calendar },
    { value: '1y', label: 'Last year', icon: Calendar },
    { value: 'custom', label: 'Custom', icon: Calendar }
  ];

  // Fetch all analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const filters = {
        startDate,
        endDate,
        country: countryFilter !== 'all' ? countryFilter : undefined,
        deviceType: deviceFilter !== 'all' ? deviceFilter : undefined
      };

      // Fetch data in parallel
      const [
        summaryData,
        timeSeriesData,
        topPagesData,
        deviceData,
        locationData,
        realTimeData
      ] = await Promise.all([
        analyticsService.getSummary(filters),
        analyticsService.getTimeSeries(filters),
        analyticsService.getTopPages(filters),
        analyticsService.getDeviceBreakdown(filters),
        analyticsService.getLocationData(filters),
        analyticsService.getRealTimeVisitors()
      ]);

      setSummary(summaryData);
      setTimeSeries(timeSeriesData);
      setTopPages(topPagesData);
      setDevices(deviceData);
      setLocations(locationData);
      setRealTimeVisitors(realTimeData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Set time range
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    const now = new Date();
    
    switch (range) {
      case '1d':
        setStartDate(startOfDay(now));
        setEndDate(endOfDay(now));
        break;
      case '7d':
        setStartDate(subDays(now, 7));
        setEndDate(now);
        break;
      case '30d':
        setStartDate(subDays(now, 30));
        setEndDate(now);
        break;
      case '90d':
        setStartDate(subDays(now, 90));
        setEndDate(now);
        break;
      case '1y':
        setStartDate(subDays(now, 365));
        setEndDate(now);
        break;
    }
  };

  // Filter top pages based on search
  const filteredTopPages = topPages.filter(page => 
    page.pageTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.pageUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initial load
  useEffect(() => {
    fetchAnalyticsData();
    
    // Refresh every 30 seconds for real-time data
    const interval = setInterval(() => {
      analyticsService.getRealTimeVisitors().then(setRealTimeVisitors);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [startDate, endDate, countryFilter, deviceFilter]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalyticsData();
  };

  // Handle export
  const handleExport = async () => {
    try {
      const blob = await analyticsService.exportData({ startDate, endDate });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  // Format numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Format time
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 flex items-center justify-center glass-panel">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"
          />
          <h2 className="text-3xl font-bold text-gradient mb-4">Loading Analytics</h2>
          <p className="text-muted-foreground">Crunching numbers and brewing insights...</p>
          <div className="mt-8 flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-2 h-2 bg-primary rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Summary stats cards with portfolio styling
  const statsCards = [
    {
      label: 'Total Visitors',
      value: formatNumber(summary?.totalVisitors || 0),
      change: '+12%',
      icon: Users,
      color: 'from-[#a78bfa] to-[#22d3ee]',
      description: 'Unique sessions',
      trend: 'up'
    },
    {
      label: 'Page Views',
      value: formatNumber(summary?.totalPageViews || 0),
      change: '+18%',
      icon: Eye,
      color: 'from-[#22d3ee] to-[#34d399]',
      description: 'Total views',
      trend: 'up'
    },
    {
      label: 'Avg. Duration',
      value: formatTime(summary?.avgSessionDuration || 0),
      change: '+23s',
      icon: Clock,
      color: 'from-[#34d399] to-[#fbbf24]',
      description: 'Per session',
      trend: 'up'
    },
    {
      label: 'Bounce Rate',
      value: `${summary?.bounceRate?.toFixed(1) || 0}%`,
      change: '-2.4%',
      icon: Activity,
      color: 'from-[#f87171] to-[#fbbf24]',
      description: 'Single page visits',
      trend: 'down'
    },
    {
      label: 'Active Now',
      value: realTimeVisitors.length.toString(),
      change: `+${Math.min(5, realTimeVisitors.length)}`,
      icon: Zap,
      color: 'from-[#fbbf24] to-[#a78bfa]',
      description: 'Real-time visitors',
      trend: 'up'
    },
    {
      label: 'Engagement',
      value: `${Math.round((summary?.avgSessionDuration || 0) / 60000)}m`,
      change: '+15%',
      icon: Target,
      color: 'from-[#8b5cf6] to-[#3b82f6]',
      description: 'Avg. time on site',
      trend: 'up'
    }
  ];

  // Device data for visualization
  const deviceIcons = {
    'Desktop': <Laptop className="w-5 h-5" />,
    'Mobile': <Phone className="w-5 h-5" />,
    'Tablet': <Tablet className="w-5 h-5" />
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
      {/* Header with Glass Effect */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel rounded-2xl p-6 mb-8 relative overflow-hidden"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold heading-responsive">
                  Analytics <span className="text-gradient">Dashboard</span>
                </h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Real-time insights, visitor behavior tracking, and performance metrics in one sleek interface
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger className="glass-card border-border w-[180px] neon-border">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent className="glass-card border-border">
                  {TIME_RANGES.map(range => {
                    const Icon = range.icon;
                    return (
                      <SelectItem key={range.value} value={range.value} className="hover:bg-accent">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {range.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="glass-card border-border hover:neon-glow transition-all duration-300"
              >
                {refreshing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh
              </Button>
              
              <Button 
                onClick={handleExport} 
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Filters with Glass Effect */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search pages, URLs, or titles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-card border-border focus-visible:ring-primary focus-visible:neon-glow"
                />
              </div>
            </div>
            
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="glass-card border-border neon-border">
                <Globe2 className="w-4 h-4 mr-2 text-primary" />
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent className="glass-card border-border">
                <SelectItem value="all">All Countries</SelectItem>
                {locations.slice(0, 10).map(location => (
                  <SelectItem key={location.countryCode} value={location.country}>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {location.country}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={deviceFilter} onValueChange={setDeviceFilter}>
              <SelectTrigger className="glass-card border-border neon-border">
                <Monitor className="w-4 h-4 mr-2 text-primary" />
                <SelectValue placeholder="All Devices" />
              </SelectTrigger>
              <SelectContent className="glass-card border-border">
                <SelectItem value="all">All Devices</SelectItem>
                {devices.map(device => (
                  <SelectItem key={device.deviceType} value={device.deviceType}>
                    <div className="flex items-center gap-2">
                      {deviceIcons[device.deviceType as keyof typeof deviceIcons] || <Monitor className="w-4 h-4" />}
                      {device.deviceType}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid with Glass Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="glass-card rounded-xl p-5 h-full hover:neon-glow transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{stat.description}</span>
                <Badge 
                  variant={stat.trend === 'up' ? 'default' : 'secondary'}
                  className={`text-xs ${
                    stat.trend === 'up' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {stat.change}
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs with Glass Effect */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="glass-panel grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 p-2 rounded-xl">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary rounded-lg gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger 
            value="realtime" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary rounded-lg gap-2"
          >
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Real-time</span>
          </TabsTrigger>
          <TabsTrigger 
            value="visitors" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary rounded-lg gap-2"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Visitors</span>
          </TabsTrigger>
          <TabsTrigger 
            value="engagement" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary rounded-lg gap-2"
          >
            <MousePointer className="w-4 h-4" />
            <span className="hidden sm:inline">Engagement</span>
          </TabsTrigger>
          <TabsTrigger 
            value="locations" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary rounded-lg gap-2"
          >
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Locations</span>
          </TabsTrigger>
          <TabsTrigger 
            value="devices" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary rounded-lg gap-2"
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">Devices</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visitors Trend Chart */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Visitors Trend</h3>
                  <p className="text-muted-foreground">Daily visitors over time</p>
                </div>
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeries}>
                    <defs>
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8' }}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8' }}
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'rgba(30, 41, 59, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '0.5rem',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      name="Visitors"
                      stroke="#a78bfa"
                      fill="url(#colorVisitors)"
                    />
                    <Area
                      type="monotone"
                      dataKey="pageViews"
                      name="Page Views"
                      stroke="#22d3ee"
                      fill="url(#colorPageViews)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Pages */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Top Pages</h3>
                  <p className="text-muted-foreground">Most visited pages</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <span>Sort by visits</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                {filteredTopPages.slice(0, 8).map((page, index) => (
                  <motion.div
                    key={page.pageUrl}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{page.pageTitle || page.pageUrl}</p>
                        <p className="text-xs text-muted-foreground truncate">{page.pageUrl}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gradient">{formatNumber(page.visitors)}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatTime(page.avgTimeOnPage || 0)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Device Breakdown */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Device Breakdown</h3>
                  <p className="text-muted-foreground">Visitor devices distribution</p>
                </div>
                <Server className="w-5 h-5 text-primary" />
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={devices}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="percentage"
                      nameKey="deviceType"
                      label={({ deviceType, percentage }) => `${deviceType}: ${percentage.toFixed(1)}%`}
                    >
                      {devices.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          stroke="rgba(30, 41, 59, 0.5)"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'rgba(30, 41, 59, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '0.5rem',
                        backdropFilter: 'blur(10px)'
                      }}
                      formatter={(value) => [`${value}%`, 'Percentage']}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Location Map */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Visitor Locations</h3>
                  <p className="text-muted-foreground">Geographic distribution</p>
                </div>
                <Globe2 className="w-5 h-5 text-primary" />
              </div>
              <div className="h-72">
                <VisitorMap locations={locations} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Real-time Tab */}
        <TabsContent value="realtime">
          <RealTimeVisitors visitors={realTimeVisitors} />
        </TabsContent>

        {/* Visitors Tab */}
        <TabsContent value="visitors">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Visitor Analysis</h3>
                <p className="text-muted-foreground">Detailed visitor insights and behavior patterns</p>
              </div>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="h-96">
              <EngagementChart timeSeries={timeSeries} />
            </div>
          </div>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Engagement Radar</h3>
                  <p className="text-muted-foreground">Visitor interaction metrics</p>
                </div>
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={timeSeries.slice(-7)}>
                    <PolarGrid stroke="#2d3748" />
                    <PolarAngleAxis 
                      dataKey="date" 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8' }}
                    />
                    <PolarRadiusAxis 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8' }}
                    />
                    <Radar
                      name="Engagement Score"
                      dataKey="visitors"
                      stroke="#a78bfa"
                      fill="#a78bfa"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'rgba(30, 41, 59, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '0.5rem',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Bounce Rate Analysis</h3>
                  <p className="text-muted-foreground">Pages with highest bounce rates</p>
                </div>
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div className="space-y-4">
                {topPages
                  .filter(page => page.bounceRate > 50)
                  .sort((a, b) => b.bounceRate - a.bounceRate)
                  .slice(0, 5)
                  .map((page, index) => (
                    <div 
                      key={page.pageUrl} 
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                          <Percent className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium">{page.pageTitle || page.pageUrl}</p>
                          <p className="text-sm text-muted-foreground">{page.visitors} visitors</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-400">
                          {page.bounceRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">bounce rate</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Geographic Analysis</h3>
                <p className="text-muted-foreground">Visitor locations and regional performance</p>
              </div>
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-[400px] rounded-xl overflow-hidden">
                  <VisitorMap locations={locations} />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Top Countries</h4>
                <div className="space-y-3">
                  {locations.slice(0, 8).map((location, index) => (
                    <motion.div
                      key={location.countryCode}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <span className="text-xs font-bold">{location.countryCode}</span>
                        </div>
                        <span className="font-medium">{location.country}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-gradient">
                          {formatNumber(location.visitors)}
                        </span>
                        <div className="text-xs text-muted-foreground">visitors</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Devices Tab */}
        <TabsContent value="devices">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Device Performance</h3>
                    <p className="text-muted-foreground">Engagement metrics by device type</p>
                  </div>
                  <div className="flex gap-2">
                    <Laptop className="w-5 h-5 text-primary" />
                    <Phone className="w-5 h-5 text-secondary" />
                    <Tablet className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={devices}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                      <XAxis 
                        dataKey="deviceType" 
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8' }}
                      />
                      <YAxis 
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8' }}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'rgba(30, 41, 59, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '0.5rem',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="count" 
                        name="Visitors" 
                        fill="url(#deviceGradient)" 
                        radius={[4, 4, 0, 0]}
                      />
                      <defs>
                        <linearGradient id="deviceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Device Insights</h3>
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-6">
                {devices.map((device, index) => (
                  <div key={device.deviceType} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {deviceIcons[device.deviceType as keyof typeof deviceIcons] || <Monitor className="w-4 h-4" />}
                        <span className="font-medium">{device.deviceType}</span>
                      </div>
                      <span className="text-lg font-bold text-gradient">{device.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${device.percentage}%` }}
                        transition={{ delay: index * 0.1, duration: 1 }}
                        className={`h-2 rounded-full ${
                          device.deviceType === 'Desktop' ? 'bg-gradient-to-r from-primary to-secondary' :
                          device.deviceType === 'Mobile' ? 'bg-gradient-to-r from-secondary to-green-400' :
                          'bg-gradient-to-r from-green-400 to-yellow-400'
                        }`}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {device.count.toLocaleString()} visitors • Avg. session: {formatTime(device.avgSessionDuration || 0)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 text-center"
      >
        <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">
            System Status: <span className="text-green-400 font-medium">Live</span> • 
            Last updated: {format(new Date(), 'PPpp')} •
            <span className="ml-2">Tracking {realTimeVisitors.length} active visitors</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;