import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Eye, 
  MousePointer, 
  Clock,
  TrendingUp,
  Calendar
} from 'lucide-react';

const Analytics = () => {
  // Mock data - replace with actual API calls
  const stats = [
    { label: 'Total Visitors', value: '1,542', icon: Users, change: '+12%' },
    { label: 'Page Views', value: '8,756', icon: Eye, change: '+8%' },
    { label: 'Unique Visitors', value: '3,214', icon: MousePointer, change: '+15%' },
    { label: 'Avg. Time', value: '3m 45s', icon: Clock, change: '+5%' },
  ];

  const popularPages = [
    { page: '/', visits: 1254, growth: 12 },
    { page: '/projects', visits: 867, growth: 8 },
    { page: '/about', visits: 654, growth: 15 },
    { page: '/blog', visits: 432, growth: 5 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your portfolio performance and visitor insights</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Last 7 days</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} from last week</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitor Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Visitor Analytics</CardTitle>
            <CardDescription>Website traffic over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Visitor chart will be displayed here</p>
                <p className="text-sm text-gray-500 mt-1">(Chart.js integration)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Pages</CardTitle>
            <CardDescription>Most visited pages on your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{page.page}</p>
                    <p className="text-sm text-gray-600">{page.visits} visits</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-medium">+{page.growth}%</p>
                    <p className="text-xs text-gray-500">growth</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Visitor devices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Desktop (62%)', 'Mobile (32%)', 'Tablet (6%)'].map((device, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{device.split(' (')[0]}</span>
                  <span className="text-sm font-medium">{device.split('(')[1]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Visitor locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['United States (35%)', 'India (22%)', 'Germany (15%)', 'UK (12%)', 'Other (16%)'].map((country, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{country.split(' (')[0]}</span>
                  <span className="text-sm font-medium">{country.split('(')[1]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement</CardTitle>
            <CardDescription>Visitor interaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Bounce Rate: 42%', 'Pages/Session: 3.2', 'Avg. Session: 3m 45s'].map((metric, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{metric.split(':')[0]}</span>
                  <span className="text-sm font-medium">{metric.split(':')[1]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;