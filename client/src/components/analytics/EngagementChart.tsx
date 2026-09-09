import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Clock, 
  MousePointer, 
  BarChart3, 
  LineChart,
  PieChart,
  Download,
  Filter
} from 'lucide-react';
import { TimeSeriesData } from '@/services/analytics';
import { format } from 'date-fns';

// Recharts
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

interface EngagementChartProps {
  timeSeries: TimeSeriesData[];
}

const EngagementChart = ({ timeSeries }: EngagementChartProps) => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [metric, setMetric] = useState<'visitors' | 'pageViews' | 'sessions' | 'avgTimeOnPage'>('visitors');
  const [timeRange, setTimeRange] = useState('30d');

  // Process data for different visualizations
  const processEngagementData = () => {
    if (!timeSeries.length) return [];
    
    const limitedData = timeRange === '7d' 
      ? timeSeries.slice(-7)
      : timeRange === '30d'
      ? timeSeries.slice(-30)
      : timeSeries;

    return limitedData.map(item => ({
      date: format(new Date(item.date), 'MMM dd'),
      visitors: item.visitors,
      pageViews: item.pageViews,
      sessions: item.sessions,
      avgTimeOnPage: Math.round(item.avgTimeOnPage / 1000), // Convert to seconds
      bounceRate: item.bounceRate
    }));
  };

  const processScrollDepthData = () => {
    // Mock scroll depth data (in real app, this would come from API)
    return [
      { depth: '0-25%', visitors: 45, percentage: 45 },
      { depth: '25-50%', visitors: 30, percentage: 30 },
      { depth: '50-75%', visitors: 15, percentage: 15 },
      { depth: '75-100%', visitors: 10, percentage: 10 }
    ];
  };

  const processTimeOfDayData = () => {
    // Mock time of day data
    return [
      { hour: '12 AM', visitors: 120 },
      { hour: '2 AM', visitors: 80 },
      { hour: '4 AM', visitors: 60 },
      { hour: '6 AM', visitors: 150 },
      { hour: '8 AM', visitors: 450 },
      { hour: '10 AM', visitors: 620 },
      { hour: '12 PM', visitors: 780 },
      { hour: '2 PM', visitors: 850 },
      { hour: '4 PM', visitors: 920 },
      { hour: '6 PM', visitors: 750 },
      { hour: '8 PM', visitors: 520 },
      { hour: '10 PM', visitors: 380 }
    ];
  };

  const engagementData = processEngagementData();
  const scrollDepthData = processScrollDepthData();
  const timeOfDayData = processTimeOfDayData();

  // Calculate engagement metrics
  const metrics = {
    totalEngagement: engagementData.reduce((sum, item) => sum + item.visitors, 0),
    avgTimeOnSite: Math.round(engagementData.reduce((sum, item) => sum + item.avgTimeOnPage, 0) / engagementData.length),
    peakHour: timeOfDayData.reduce((max, item) => item.visitors > max.visitors ? item : max, timeOfDayData[0]),
    scrollDepthAvg: scrollDepthData.reduce((sum, item, index) => {
      const depthValue = index * 25 + 12.5; // Midpoint of each range
      return sum + (item.percentage / 100) * depthValue;
    }, 0)
  };

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Render main chart based on type
  const renderMainChart = () => {
    const ChartComponent = chartType === 'line' 
      ? RechartsLineChart 
      : chartType === 'bar'
      ? RechartsBarChart
      : AreaChart;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={engagementData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Legend />
          {chartType === 'area' ? (
            <>
              <Area 
                type="monotone" 
                dataKey={metric} 
                name={metric === 'avgTimeOnPage' ? 'Avg Time (s)' : metric}
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.2}
              />
              <Area 
                type="monotone" 
                dataKey="sessions" 
                name="Sessions"
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.2}
              />
            </>
          ) : chartType === 'bar' ? (
            <Bar 
              dataKey={metric} 
              name={metric === 'avgTimeOnPage' ? 'Avg Time (s)' : metric}
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
            />
          ) : (
            <>
              <Line 
                type="monotone" 
                dataKey={metric} 
                name={metric === 'avgTimeOnPage' ? 'Avg Time (s)' : metric}
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="sessions" 
                name="Sessions"
                stroke="#8b5cf6" 
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Engagement Analytics</h2>
          <p className="text-gray-600 mt-1">Track visitor interaction and behavior patterns</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={metric} onValueChange={(value: any) => setMetric(value)}>
            <SelectTrigger className="w-[160px]">
              <TrendingUp className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visitors">Visitors</SelectItem>
              <SelectItem value="pageViews">Page Views</SelectItem>
              <SelectItem value="sessions">Sessions</SelectItem>
              <SelectItem value="avgTimeOnPage">Avg. Time</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex border rounded-lg">
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('line')}
              className="rounded-r-none"
            >
              <LineChart className="w-4 h-4" />
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('bar')}
              className="rounded-none"
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              variant={chartType === 'area' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('area')}
              className="rounded-l-none"
            >
              <AreaChart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Engagement</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.totalEngagement.toLocaleString()}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-blue-100">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Time on Site</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.avgTimeOnSite}s</p>
              </div>
              <div className="p-2 rounded-lg bg-green-100">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Peak Hour</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.peakHour.hour}</p>
                <p className="text-sm text-gray-600">{metrics.peakHour.visitors} visitors</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-100">
                <MousePointer className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Scroll Depth</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.scrollDepthAvg.toFixed(1)}%</p>
              </div>
              <div className="p-2 rounded-lg bg-orange-100">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different charts */}
      <Tabs defaultValue="engagement" className="space-y-6">
        <TabsList className="grid grid-cols-3 gap-2">
          <TabsTrigger value="engagement" className="gap-2">
            <LineChart className="w-4 h-4" />
            Engagement Trends
          </TabsTrigger>
          <TabsTrigger value="scrolldepth" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Scroll Depth
          </TabsTrigger>
          <TabsTrigger value="timeofday" className="gap-2">
            <Clock className="w-4 h-4" />
            Time of Day
          </TabsTrigger>
        </TabsList>

        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Over Time</CardTitle>
              <CardDescription>
                Track how visitors interact with your site over {timeRange}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderMainChart()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scrolldepth">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Scroll Depth Analysis</CardTitle>
                <CardDescription>
                  How far visitors scroll down your pages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={scrollDepthData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ depth, percentage }) => `${depth}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {scrollDepthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scroll Depth Insights</CardTitle>
                <CardDescription>
                  Key metrics from scroll behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scrollDepthData.map((item, index) => (
                    <div key={item.depth} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{item.depth}</span>
                        <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-600">
                        {item.visitors} visitors scrolled to this depth
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeofday">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Activity by Time of Day</CardTitle>
              <CardDescription>
                When are visitors most active on your site?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={timeOfDayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hour" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="visitors" 
                    name="Visitors" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
              
              {/* Insights */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Insights</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Peak traffic occurs between {metrics.peakHour.hour} with {metrics.peakHour.visitors} visitors</li>
                  <li>• Lowest traffic typically between 2 AM - 4 AM</li>
                  <li>• Engagement is highest during business hours (9 AM - 5 PM)</li>
                  <li>• Consider scheduling important content during peak hours</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Engagement Rate</CardTitle>
            <CardDescription>
              Percentage of engaged visitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray="75, 100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold text-gray-900">75%</span>
                    <span className="text-sm text-gray-600">Engaged</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                3 out of 4 visitors are actively engaging with content
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Engagement Recommendations</CardTitle>
            <CardDescription>
              Suggestions to improve visitor engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="p-2 rounded-lg bg-green-100">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Improve Scroll Depth</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Only 25% of visitors scroll past 50%. Consider placing key content higher on the page.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Optimize for Mobile</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    40% of visitors use mobile devices. Ensure mobile experience is seamless.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="p-2 rounded-lg bg-purple-100">
                  <MousePointer className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Add Interactive Elements</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Interactive content increases engagement by 47%. Consider adding quizzes or polls.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EngagementChart;