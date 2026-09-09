import { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User,
  MapPin,
  Monitor,
  Globe,
  Clock,
  Calendar,
  ExternalLink,
  ArrowLeft,
  Activity,
  TrendingUp,
  MousePointer,
  Download,
  Smartphone,
  Tablet,
  Shield,
  Cpu,
  HardDrive,
  Wifi,
  Target
} from 'lucide-react';
import { analyticsService } from '@/services/analytics';
import { format, formatDistanceToNow, formatDuration, intervalToDuration } from 'date-fns';

// Recharts
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const VisitorDetails = () => {
  const { visitorId } = useParams();
  const [loading, setLoading] = useState(true);
  const [visitorData, setVisitorData] = useState<any>(null);
  const [journeyData, setJourneyData] = useState<any[]>([]);

  // Fetch visitor details
  useEffect(() => {
    if (visitorId) {
      fetchVisitorDetails();
    }
  }, [visitorId]);

  const fetchVisitorDetails = async () => {
    try {
      setLoading(true);
      const [details, journey] = await Promise.all([
        analyticsService.getVisitorDetails(visitorId!),
        analyticsService.getVisitorJourney(visitorId!)
      ]);
      
      setVisitorData(details);
      setJourneyData(journey);
    } catch (error) {
      console.error('Error fetching visitor details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900">Loading Visitor Details</h2>
          <p className="text-gray-600 mt-2">Fetching visitor information...</p>
        </div>
      </div>
    );
  }

  if (!visitorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <User className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Visitor Not Found</h2>
            <p className="text-gray-600 mt-2 mb-6">
              The visitor you're looking for doesn't exist or has been deleted.
            </p>
            <Link href="/admin/analytics">
              <Button className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const duration = intervalToDuration({
    start: new Date(visitorData.firstVisit),
    end: new Date(visitorData.lastVisit)
  });

  const formatTimeSpent = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  // Recent activity chart data
  const activityData = journeyData.map(event => ({
    time: format(new Date(event.timestamp), 'HH:mm'),
    page: event.pageUrl.split('/').pop() || 'Home',
    duration: event.timeOnPage ? Math.round(event.timeOnPage / 1000) : 0
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link href="/admin/analytics">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Visitor Details</h1>
            <Badge variant="outline" className="ml-2">
              ID: {visitorId?.substring(0, 8)}...
            </Badge>
          </div>
          
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>
        
        <p className="text-gray-600">
          Detailed tracking and analysis of individual visitor behavior
        </p>
      </div>

      {/* Visitor Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Visitor Profile */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Visitor Profile
            </CardTitle>
            <CardDescription>
              Basic information and identification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Visitor ID</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">
                    {visitorData.visitorId}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">First Visit</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(visitorData.firstVisit), 'PPpp')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(visitorData.firstVisit), { addSuffix: true })}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Last Visit</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(visitorData.lastVisit), 'PPpp')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(visitorData.lastVisit), { addSuffix: true })}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Visits</p>
                  <p className="text-2xl font-bold text-gray-900">{visitorData.totalVisits}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Total Page Views</p>
                  <p className="text-2xl font-bold text-gray-900">{visitorData.totalPageViews}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Average Time per Visit</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatTimeSpent(visitorData.avgTimePerVisit)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              Technical Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Countries</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {visitorData.countries?.slice(0, 3).map((country: string) => (
                  <Badge key={country} variant="outline">
                    {country}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Devices</span>
              </div>
              <div className="flex gap-1">
                {visitorData.devices?.map((device: string) => (
                  <Badge key={device} variant="secondary">
                    {device === 'mobile' ? <Smartphone className="w-3 h-3 mr-1" /> : 
                     device === 'tablet' ? <Tablet className="w-3 h-3 mr-1" /> : 
                     <Monitor className="w-3 h-3 mr-1" />}
                    {device}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Browsers</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {visitorData.browsers?.slice(0, 2).map((browser: string) => (
                  <Badge key={browser} variant="outline">
                    {browser}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Pages Viewed</span>
              </div>
              <Badge>{visitorData.pages}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed views */}
      <Tabs defaultValue="journey" className="space-y-6">
        <TabsList className="grid grid-cols-4 gap-2">
          <TabsTrigger value="journey" className="gap-2">
            <Activity className="w-4 h-4" />
            Journey
          </TabsTrigger>
          <TabsTrigger value="behavior" className="gap-2">
            <MousePointer className="w-4 h-4" />
            Behavior
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Visitor Journey */}
        <TabsContent value="journey">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Journey</CardTitle>
              <CardDescription>
                Complete path taken by the visitor through your site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {journeyData.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Activity className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No Journey Data</h3>
                    <p className="text-gray-600">
                      No detailed journey data available for this visitor
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-200"></div>
                    
                    {/* Timeline items */}
                    {journeyData.map((event, index) => (
                      <div key={index} className="relative pl-16 pb-6">
                        {/* Timeline dot */}
                        <div className={`absolute left-5 w-4 h-4 rounded-full border-4 border-white ${
                          event.eventType === 'page_view' ? 'bg-blue-500' :
                          event.eventType === 'click' ? 'bg-green-500' :
                          event.eventType === 'scroll' ? 'bg-purple-500' :
                          'bg-gray-500'
                        }`}></div>
                        
                        {/* Event card */}
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant={
                                    event.eventType === 'page_view' ? 'default' :
                                    event.eventType === 'click' ? 'secondary' :
                                    'outline'
                                  }>
                                    {event.eventType.replace('_', ' ')}
                                  </Badge>
                                  <span className="text-sm text-gray-500">
                                    {format(new Date(event.timestamp), 'HH:mm:ss')}
                                  </span>
                                </div>
                                
                                <h4 className="font-medium text-gray-900">
                                  {event.pageTitle || event.pageUrl}
                                </h4>
                                <p className="text-sm text-gray-600 truncate">
                                  {event.pageUrl}
                                </p>
                                
                                {event.timeOnPage && (
                                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    <span>Time on page: {formatTimeSpent(event.timeOnPage)}</span>
                                  </div>
                                )}
                                
                                {event.scrollDepth && (
                                  <div className="mt-2">
                                    <p className="text-sm text-gray-600 mb-1">Scroll depth: {event.scrollDepth}%</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${event.scrollDepth}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <Button variant="outline" size="sm" className="gap-2">
                                <ExternalLink className="w-4 h-4" />
                                View Page
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavior Analysis */}
        <TabsContent value="behavior">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>Visitor interaction patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Pages per Visit</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {(visitorData.totalPageViews / visitorData.totalVisits).toFixed(1)}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Visit Frequency</p>
                      <p className="text-2xl font-bold text-gray-900">
                        Every {formatDuration(duration, { format: ['days', 'hours'] })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Behavior Patterns</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Typically visits during business hours</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Engages deeply with content (75%+ scroll depth)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Prefers desktop browsing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Returns frequently (loyal visitor)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>Recent activity visualization</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData.slice(-10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="duration" 
                      name="Time Spent (s)" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Visit Timeline</CardTitle>
              <CardDescription>Historical visit patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visitorData.recentActivity?.slice(-20)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="#6b7280"
                      tickFormatter={(value) => format(new Date(value), 'MM/dd')}
                    />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      labelFormatter={(value) => format(new Date(value), 'PPpp')}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="visits" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights */}
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Insights</CardTitle>
              <CardDescription>Analysis and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Visitor Type</h4>
                  <p className="text-gray-700">
                    This visitor is a <strong>Loyal User</strong> based on their frequent returns 
                    and deep engagement with content. They show strong interest in your portfolio.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Strengths</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• High engagement rate (75%+ scroll depth)</li>
                      <li>• Frequent return visits</li>
                      <li>• Long session durations</li>
                      <li>• Multiple page views per visit</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Opportunities</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Could engage more with interactive elements</li>
                      <li>• Mobile optimization could improve experience</li>
                      <li>• Consider personalized content</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Personalized Content</p>
                        <p className="text-sm text-gray-700">
                          Since this visitor shows interest in specific areas, consider showing 
                          them personalized project recommendations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Wifi className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Engagement Opportunities</p>
                        <p className="text-sm text-gray-700">
                          Consider adding newsletter signup or contact form on pages they frequently visit.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Retention Strategy</p>
                        <p className="text-sm text-gray-700">
                          This loyal visitor is valuable. Consider implementing a loyalty program 
                          or exclusive content for frequent visitors.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="outline" className="gap-2">
          <ExternalLink className="w-4 h-4" />
          View Similar Visitors
        </Button>
        
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Download Report
        </Button>
        
        <Button className="gap-2 ml-auto">
          <TrendingUp className="w-4 h-4" />
          Create Remarketing Campaign
        </Button>
      </div>
    </div>
  );
};

export default VisitorDetails;