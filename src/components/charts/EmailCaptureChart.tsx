import React, { useState, useEffect } from 'react';
import { Mail, User, Calendar, Globe, Download, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { getEmailCaptures, EmailCapture } from '../../lib/api';

interface EmailCaptureChartProps {
  linkId: string;
  totalCaptures: number;
}

const EmailCaptureChart: React.FC<EmailCaptureChartProps> = ({ linkId, totalCaptures }) => {
  const [captures, setCaptures] = useState<EmailCapture[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEmails, setShowEmails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  useEffect(() => {
    fetchEmailCaptures();
  }, [linkId, currentPage]);

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

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Captured At', 'Referrer', 'User Agent'];
    const csvContent = [
      headers.join(','),
      ...captures.map(capture => [
        `"${capture.name}"`,
        `"${capture.email}"`,
        `"${formatDate(capture.capturedAt)}"`,
        `"${capture.referrer || 'Direct'}"`,
        `"${capture.userAgent || 'Unknown'}"`
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
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
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
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading email captures...</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {captures.map((capture) => (
                <div
                  key={capture.id}
                  className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-900/70 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <User className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">{capture.name}</h4>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">
                          {showEmails ? capture.email : maskEmail(capture.email)}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(capture.capturedAt)}
                          </div>
                          {capture.referrer && (
                            <div className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {capture.referrer === 'direct' ? 'Direct' : new URL(capture.referrer).hostname}
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
