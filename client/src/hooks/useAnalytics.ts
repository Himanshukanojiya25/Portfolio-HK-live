import { useState, useEffect, useCallback } from 'react';
import { analyticsService, AnalyticsFilters, AnalyticsSummary, TimeSeriesData, TopPagesData, DeviceData, LocationData, RealTimeVisitor } from '@/services/analytics';
import { subDays } from 'date-fns';

interface UseAnalyticsReturn {
  // Data
  summary: AnalyticsSummary | null;
  timeSeries: TimeSeriesData[];
  topPages: TopPagesData[];
  devices: DeviceData[];
  locations: LocationData[];
  realTimeVisitors: RealTimeVisitor[];
  
  // State
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  
  // Filters
  filters: AnalyticsFilters;
  
  // Actions
  refresh: () => Promise<void>;
  setFilters: (filters: AnalyticsFilters) => void;
  setTimeRange: (days: number) => void;
}

export const useAnalytics = (initialFilters: AnalyticsFilters = {}): UseAnalyticsReturn => {
  const [data, setData] = useState<{
    summary: AnalyticsSummary | null;
    timeSeries: TimeSeriesData[];
    topPages: TopPagesData[];
    devices: DeviceData[];
    locations: LocationData[];
    realTimeVisitors: RealTimeVisitor[];
  }>({
    summary: null,
    timeSeries: [],
    topPages: [],
    devices: [],
    locations: [],
    realTimeVisitors: []
  });
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilters>({
    startDate: subDays(new Date(), 7),
    endDate: new Date(),
    ...initialFilters
  });

  // Fetch all analytics data
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const isRefreshing = refreshing;
      
      if (!isRefreshing) {
        setLoading(true);
      }

      // Fetch all data in parallel
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

      setData({
        summary: summaryData,
        timeSeries: timeSeriesData,
        topPages: topPagesData,
        devices: deviceData,
        locations: locationData,
        realTimeVisitors: realTimeData
      });
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again.');
      
      // Set empty data on error
      setData({
        summary: null,
        timeSeries: [],
        topPages: [],
        devices: [],
        locations: [],
        realTimeVisitors: []
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters, refreshing]);

  // Initial load
  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh for real-time data
    const interval = setInterval(async () => {
      try {
        const realTimeData = await analyticsService.getRealTimeVisitors();
        setData(prev => ({
          ...prev,
          realTimeVisitors: realTimeData
        }));
      } catch (err) {
        console.error('Error refreshing real-time data:', err);
      }
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchData]);

  // Manual refresh
  const refresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  // Set time range
  const setTimeRange = (days: number) => {
    setFilters(prev => ({
      ...prev,
      startDate: subDays(new Date(), days),
      endDate: new Date()
    }));
  };

  // Update filters
  const updateFilters = (newFilters: AnalyticsFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  return {
    ...data,
    loading,
    refreshing,
    error,
    filters,
    refresh,
    setFilters: updateFilters,
    setTimeRange
  };
};

// Hook for tracking page views
export const usePageTracking = () => {
  const trackPageView = useCallback((pageUrl: string, pageTitle: string, timeOnPage?: number, scrollDepth?: number) => {
    analyticsService.trackPageView(pageUrl, pageTitle, timeOnPage, scrollDepth);
  }, []);

  const trackClick = useCallback((elementId: string, elementText: string, pageUrl: string) => {
    analyticsService.trackClick(elementId, elementText, pageUrl);
  }, []);

  const trackScroll = useCallback((scrollDepth: number, pageUrl: string) => {
    analyticsService.trackScroll(scrollDepth, pageUrl);
  }, []);

  const trackFormSubmit = useCallback((formName: string, pageUrl: string) => {
    analyticsService.trackFormSubmit(formName, pageUrl);
  }, []);

  const trackDownload = useCallback((fileName: string, pageUrl: string) => {
    analyticsService.trackDownload(fileName, pageUrl);
  }, []);

  return {
    trackPageView,
    trackClick,
    trackScroll,
    trackFormSubmit,
    trackDownload
  };
};