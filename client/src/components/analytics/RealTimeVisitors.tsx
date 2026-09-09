import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  MapPin, 
  Monitor, 
  Globe, 
  Clock,
  RefreshCw,
  ExternalLink,
  Eye,
  MousePointer,
  Activity,
  Zap,
  Loader2
} from 'lucide-react';
import { analyticsService, RealTimeVisitor } from '@/services/analytics';
import { formatDistanceToNow } from 'date-fns';

interface RealTimeVisitorsProps {
  visitors?: RealTimeVisitor[];
}

const RealTimeVisitors = ({ visitors: initialVisitors }: RealTimeVisitorsProps) => {
  const [visitors, setVisitors] = useState<RealTimeVisitor[]>(initialVisitors || []);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const fetchRealTimeVisitors = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getRealTimeVisitors();
      setVisitors(data);
    } catch (error) {
      console.error('Error fetching real-time visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialVisitors) {
      fetchRealTimeVisitors();
    }
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchRealTimeVisitors, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filter visitors
  const filteredVisitors = visitors.filter(visitor => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'mobile') return visitor.deviceType === 'mobile';
    if (activeFilter === 'desktop') return visitor.deviceType === 'desktop';
    if (activeFilter === 'tablet') return visitor.deviceType === 'tablet';
    return true;
  });

  // Get device icon
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  // Get browser color
  const getBrowserColor = (browser: string) => {
    switch (browser.toLowerCase()) {
      case 'chrome': return 'bg-red-100 text-red-800';
      case 'firefox': return 'bg-orange-100 text-orange-800';
      case 'safari': return 'bg-blue-100 text-blue-800';
      case 'edge': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get country flag emoji
  const getCountryFlag = (countryCode: string) => {
    if (!countryCode || countryCode.length !== 2) return '🌐';
    return countryCode
      .toUpperCase()
      .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
  };

  // Stats
  const stats = {
    total: visitors.length,
    countries: new Set(visitors.map(v => v.country)).size,
    devices: {
      desktop: visitors.filter(v => v.deviceType === 'desktop').length,
      mobile: visitors.filter(v => v.deviceType === 'mobile').length,
      tablet: visitors.filter(v => v.deviceType === 'tablet').length,
    },
    avgTime: Math.round(visitors.reduce((sum, v) => sum + v.timeOnPage, 0) / (visitors.length || 1) / 1000)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-500" />
            Real-time Visitors
            <Badge variant="outline" className="ml-2">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Live
            </Badge>
          </h2>
          <p className="text-gray-600 mt-1">
            Track visitors currently browsing your site
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Auto-refreshes every 10 seconds
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRealTimeVisitors}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Now</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-2 rounded-lg bg-green-100">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Countries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.countries}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-100">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mobile Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.devices.mobile}</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-100">
                <Smartphone className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Time</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgTime}s</p>
              </div>
              <div className="p-2 rounded-lg bg-orange-100">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('all')}
        >
          All Visitors ({visitors.length})
        </Button>
        <Button
          variant={activeFilter === 'desktop' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('desktop')}
          className="gap-2"
        >
          <Monitor className="w-4 h-4" />
          Desktop ({stats.devices.desktop})
        </Button>
        <Button
          variant={activeFilter === 'mobile' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('mobile')}
          className="gap-2"
        >
          <Smartphone className="w-4 h-4" />
          Mobile ({stats.devices.mobile})
        </Button>
        <Button
          variant={activeFilter === 'tablet' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('tablet')}
          className="gap-2"
        >
          <Tablet className="w-4 h-4" />
          Tablet ({stats.devices.tablet})
        </Button>
      </div>

      {/* Visitors List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Currently {filteredVisitors.length} active visitor{filteredVisitors.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredVisitors.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No active visitors</h3>
              <p className="text-gray-600 mt-1">
                Visitors will appear here when they're browsing your site
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredVisitors.map((visitor, index) => (
                <motion.div
                  key={visitor.sessionId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(visitor.deviceType)}
                          <Badge variant="outline" className={getBrowserColor(visitor.browser)}>
                            {visitor.browser}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getCountryFlag(visitor.country || '')}
                          </span>
                          <span className="text-sm text-gray-600">
                            {visitor.city || 'Unknown'}, {visitor.country || 'Unknown'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <p className="font-medium text-gray-900 truncate">
                          {visitor.pageTitle || visitor.pageUrl}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {visitor.pageUrl}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mt-3">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Eye className="w-4 h-4" />
                          <span>Viewing for {Math.round(visitor.timeOnPage / 1000)}s</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Zap className="w-4 h-4" />
                          <span>Active {formatDistanceToNow(new Date(visitor.lastActive), { addSuffix: true })}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MousePointer className="w-4 h-4" />
                          <span>Session: {visitor.sessionId.substring(0, 8)}...</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 lg:ml-4 flex items-center gap-2">
                      <Badge variant="secondary" className="gap-1">
                        {visitor.os}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          // Navigate to visitor details
                          console.log('View visitor details:', visitor.visitorId);
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Device Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
            <CardDescription>Current active visitors by device</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.devices).map(([device, count]) => (
                <div key={device} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(device)}
                    <span className="font-medium capitalize">{device}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(count / stats.total) * 100}%`
                        }}
                      />
                    </div>
                    <span className="font-semibold w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Current visitors by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {Array.from(new Set(visitors.map(v => v.country)))
                .filter(country => country && country !== 'Unknown')
                .slice(0, 10)
                .map(country => {
                  const countryVisitors = visitors.filter(v => v.country === country).length;
                  return (
                    <div key={country} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getCountryFlag(country)}
                        </span>
                        <span className="font-medium">{country}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${(countryVisitors / stats.total) * 100}%`
                            }}
                          />
                        </div>
                        <span className="font-semibold w-8 text-right">
                          {countryVisitors}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeVisitors;