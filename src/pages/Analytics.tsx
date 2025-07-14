import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  ArrowLeft, Globe, Smartphone, Monitor, Calendar, Clock,
  TrendingUp, Users, Eye, MousePointer, MapPin, Wifi,
  Zap, BarChart3, PieChart
} from 'lucide-react';
import { getLinkAnalytics, getLinkById } from '../lib/api';
import { Link } from '../types/database';
import CountryChart from '../components/charts/CountryChart';
import DeviceChart from '../components/charts/DeviceChart';
import BrowserChart from '../components/charts/BrowserChart';
import TimeChart from '../components/charts/TimeChart';
import ActivityFeed from '../components/charts/ActivityFeed';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import '../styles/analytics.css';

interface AnalyticsData {
  linkId: string;
  totalClicks: number;
  uniqueClicks: number;
  clicksByCountry: Record<string, number>;
  clicksByDevice: Record<string, number>;
  clicksByBrowser: Record<string, number>;
  clicksByOS: Record<string, number>;
  clicksByDate: Record<string, number>;
  topReferrers: Array<{ domain: string; clicks: number }>;
  recentClicks: any[];
}

const Analytics: React.FC = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [link, setLink] = useState<Link | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!linkId || !user?.id) return;
      
      try {
        // Load link details and analytics
        const [linkData, analyticsData] = await Promise.all([
          getLinkById(linkId, user.id),
          getLinkAnalytics(linkId, user.id)
        ]);
        
        setLink(linkData);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [linkId, user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!link || !analytics) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Analytics Not Found</h1>
          <p className="text-gray-400 mb-6">Unable to load analytics for this link</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Link Analytics</h1>
                <p className="text-gray-600 text-sm">
                  {link.title || 'Untitled Link'} • trackerr.pro/{link.shortCode}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Clicks</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.totalClicks.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <MousePointer className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Unique Visitors</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.uniqueClicks.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Countries</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{Object.keys(analytics.clicksByCountry).length}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Click Rate</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {analytics.totalClicks > 0 ? ((analytics.uniqueClicks / analytics.totalClicks) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Geographic Distribution */}
        <div className="mb-12">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-gray-900 text-xl font-semibold">
                <Globe className="w-5 h-5 text-gray-600" />
                Geographic Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <CountryChart data={analytics.clicksByCountry} totalClicks={analytics.totalClicks} />
            </CardContent>
          </Card>
        </div>

        {/* Device & Browser Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-gray-900 text-xl font-semibold">
                <Smartphone className="w-5 h-5 text-gray-600" />
                Device Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <DeviceChart data={analytics.clicksByDevice} totalClicks={analytics.totalClicks} />
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-gray-900 text-xl font-semibold">
                <Globe className="w-5 h-5 text-gray-600" />
                Browser Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <BrowserChart data={analytics.clicksByBrowser} totalClicks={analytics.totalClicks} />
            </CardContent>
          </Card>
        </div>

        {/* Time Analytics */}
        <div className="mb-12">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-gray-900 text-xl font-semibold">
                <Calendar className="w-5 h-5 text-gray-600" />
                Click Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <TimeChart data={analytics.clicksByDate} totalClicks={analytics.totalClicks} />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-gray-900 text-xl font-semibold">
                <Zap className="w-5 h-5 text-gray-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ActivityFeed recentClicks={analytics.recentClicks} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
