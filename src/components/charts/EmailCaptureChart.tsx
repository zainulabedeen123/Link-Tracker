import React, { useState, useEffect } from 'react';
import {
  User, Calendar, Globe, Download, Eye, EyeOff,
  Smartphone, Monitor, MapPin, Clock, Filter,
  ArrowUpDown, ArrowUp, ArrowDown, Flag
} from 'lucide-react';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { getEmailCaptures, EmailCapture } from '../../lib/api';

interface EmailCaptureChartProps {
  linkId: string;
  totalCaptures: number;
}

type SortField = 'capturedAt' | 'name' | 'email' | 'country' | 'device';
type SortDirection = 'asc' | 'desc';

const EmailCaptureChart: React.FC<EmailCaptureChartProps> = ({ linkId, totalCaptures }) => {
  const [captures, setCaptures] = useState<EmailCapture[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEmails, setShowEmails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('capturedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterCountry, setFilterCountry] = useState<string>('');
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  useEffect(() => {
    fetchEmailCaptures();
  }, [linkId, currentPage]);

  useEffect(() => {
    sortCaptures();
  }, [sortField, sortDirection, filterCountry]);

  const fetchEmailCaptures = async () => {
    try {
      setLoading(true);
      const response = await getEmailCaptures(linkId, currentPage, 10);
      setCaptures(response.captures);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching email captures:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortCaptures = () => {
    const sorted = [...captures].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle date sorting
      if (sortField === 'capturedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply country filter
    const filtered = filterCountry
      ? sorted.filter(capture => capture.country?.toLowerCase().includes(filterCountry.toLowerCase()))
      : sorted;

    setCaptures(filtered);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.length > 2
      ? username.substring(0, 2) + '*'.repeat(username.length - 2)
      : username;
    return `${maskedUsername}@${domain}`;
  };

  const getLocationString = (capture: EmailCapture) => {
    const parts = [];
    if (capture.city) parts.push(capture.city);
    if (capture.region) parts.push(capture.region);
    if (capture.country) parts.push(capture.country);
    return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
  };

  const getDeviceIcon = (capture: EmailCapture) => {
    if (capture.isMobile) {
      return <Smartphone className="w-4 h-4 text-blue-400" />;
    }
    return <Monitor className="w-4 h-4 text-green-400" />;
  };

  const getCountryFlag = (countryCode: string) => {
    // Simple country code to flag emoji mapping
    const flagMap: Record<string, string> = {
      'US': '🇺🇸', 'GB': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺', 'DE': '🇩🇪',
      'FR': '🇫🇷', 'IT': '🇮🇹', 'ES': '🇪🇸', 'NL': '🇳🇱', 'SE': '🇸🇪',
      'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'JP': '🇯🇵', 'KR': '🇰🇷',
      'CN': '🇨🇳', 'IN': '🇮🇳', 'BR': '🇧🇷', 'MX': '🇲🇽', 'AR': '🇦🇷'
    };
    return flagMap[countryCode] || '🌍';
  };

  const exportToCSV = () => {
    const headers = [
      'Name', 'Email', 'Captured At', 'Country', 'Region', 'City',
      'Device', 'Browser', 'OS', 'Mobile', 'Referrer', 'IP Address'
    ];
    const csvContent = [
      headers.join(','),
      ...captures.map(capture => [
        `"${capture.name}"`,
        `"${capture.email}"`,
        `"${formatDate(capture.capturedAt)}"`,
        `"${capture.country || 'Unknown'}"`,
        `"${capture.region || 'Unknown'}"`,
        `"${capture.city || 'Unknown'}"`,
        `"${capture.device || 'Unknown'}"`,
        `"${capture.browser || 'Unknown'}"`,
        `"${capture.os || 'Unknown'}"`,
        `"${capture.isMobile ? 'Yes' : 'No'}"`,
        `"${capture.referrer || 'Direct'}"`,
        `"${capture.ipAddress || 'Unknown'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-captures-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (totalCaptures === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            Email Captures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Mail className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No Email Captures Yet</h3>
            <p className="text-gray-500 text-sm">
              Email captures will appear here when visitors submit their information.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border border-gray-700 shadow-sm">
      <CardHeader className="border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-orange-400" />
            Email Captures ({totalCaptures})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowEmails(!showEmails)}
              variant="outline"
              size="sm"
              className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              {showEmails ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1" />
                  Hide Emails
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1" />
                  Show Emails
                </>
              )}
            </Button>
            <Button
              onClick={exportToCSV}
              variant="outline"
              size="sm"
              className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              disabled={captures.length === 0}
            >
              <Download className="w-4 h-4 mr-1" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Sorting and Filtering Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Sort by:</span>
            <Button
              onClick={() => handleSort('capturedAt')}
              variant="outline"
              size="sm"
              className={`bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 ${
                sortField === 'capturedAt' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <Clock className="w-4 h-4 mr-1" />
              Date {getSortIcon('capturedAt')}
            </Button>
            <Button
              onClick={() => handleSort('name')}
              variant="outline"
              size="sm"
              className={`bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 ${
                sortField === 'name' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <User className="w-4 h-4 mr-1" />
              Name {getSortIcon('name')}
            </Button>
            <Button
              onClick={() => handleSort('country')}
              variant="outline"
              size="sm"
              className={`bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 ${
                sortField === 'country' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <Flag className="w-4 h-4 mr-1" />
              Country {getSortIcon('country')}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Filter:</span>
            <input
              type="text"
              placeholder="Filter by country..."
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading email captures...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {captures.map((capture) => (
                <div
                  key={capture.id}
                  className="bg-gray-800/50 border border-gray-600 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-200 hover:border-gray-500"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                        <User className="w-5 h-5 text-blue-400" />
                      </div>

                      <div className="flex-1 space-y-3">
                        {/* Name and Email */}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-white text-lg">{capture.name}</h4>
                            {capture.country && (
                              <span className="text-lg">{getCountryFlag(capture.country)}</span>
                            )}
                          </div>
                          <p className="text-gray-300 font-mono">
                            {showEmails ? capture.email : maskEmail(capture.email)}
                          </p>
                        </div>

                        {/* Location and Device Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Location */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <MapPin className="w-4 h-4 text-green-400" />
                              <span className="font-medium">Location</span>
                            </div>
                            <p className="text-white text-sm ml-6">
                              {getLocationString(capture)}
                            </p>
                          </div>

                          {/* Device Info */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              {getDeviceIcon(capture)}
                              <span className="font-medium">Device</span>
                            </div>
                            <div className="ml-6 space-y-1">
                              <p className="text-white text-sm">
                                {capture.device || 'Unknown Device'}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {capture.browser || 'Unknown Browser'} • {capture.os || 'Unknown OS'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-700">
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            {formatDate(capture.capturedAt)}
                          </div>

                          {capture.referrer && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Globe className="w-3 h-3" />
                              {capture.referrer === 'direct' ? 'Direct' :
                                (() => {
                                  try {
                                    return new URL(capture.referrer).hostname;
                                  } catch {
                                    return capture.referrer;
                                  }
                                })()
                              }
                            </div>
                          )}

                          {capture.ipAddress && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Wifi className="w-3 h-3" />
                              {capture.ipAddress}
                            </div>
                          )}

                          {capture.timezone && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              {capture.timezone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.total)} of {pagination.total} captures
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-400">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailCaptureChart;
