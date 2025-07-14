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
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Link Analytics</h1>
                <p className="text-gray-400 text-sm">
                  {link.title || 'Untitled Link'} • trackerr.pro/{link.shortCode}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="stat-card bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500/50 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Clicks</p>
                  <p className="text-3xl font-bold text-white counter">{analytics.totalClicks.toLocaleString()}</p>
                </div>
                <MousePointer className="w-8 h-8 text-blue-200 float" />
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card bg-gradient-to-br from-green-600 to-green-700 border-green-500/50 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Unique Visitors</p>
                  <p className="text-3xl font-bold text-white counter">{analytics.uniqueClicks.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-green-200 float" />
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500/50 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Countries</p>
                  <p className="text-3xl font-bold text-white counter">{Object.keys(analytics.clicksByCountry).length}</p>
                </div>
                <Globe className="w-8 h-8 text-purple-200 float" />
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card bg-gradient-to-br from-orange-600 to-orange-700 border-orange-500/50 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Click Rate</p>
                  <p className="text-3xl font-bold text-white counter">
                    {analytics.totalClicks > 0 ? ((analytics.uniqueClicks / analytics.totalClicks) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-200 float" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="geography" className="data-[state=active]:bg-gray-700">
              Geography
            </TabsTrigger>
            <TabsTrigger value="devices" className="data-[state=active]:bg-gray-700">
              Devices
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-gray-700">
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="chart-container bg-gray-900/50 border-gray-700 hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Globe className="w-5 h-5 text-blue-400" />
                    Browser Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BrowserChart data={analytics.clicksByBrowser} totalClicks={analytics.totalClicks} />
                </CardContent>
              </Card>

              <Card className="chart-container bg-gray-900/50 border-gray-700 hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Calendar className="w-5 h-5 text-green-400" />
                    Time Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TimeChart data={analytics.clicksByDate} totalClicks={analytics.totalClicks} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="geography">
            <Card className="chart-container bg-gray-900/50 border-gray-700 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Globe className="w-5 h-5 text-blue-400" />
                  Geographic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CountryChart data={analytics.clicksByCountry} totalClicks={analytics.totalClicks} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices">
            <Card className="chart-container bg-gray-900/50 border-gray-700 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Smartphone className="w-5 h-5 text-green-400" />
                  Device Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DeviceChart data={analytics.clicksByDevice} totalClicks={analytics.totalClicks} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <ActivityFeed recentClicks={analytics.recentClicks} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
