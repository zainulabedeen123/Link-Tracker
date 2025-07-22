import React, { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { Link as LinkIcon, BarChart3, QrCode, Globe, Copy, ExternalLink, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CreateLinkRequest, Link } from '../types/database';
import { createLink, getUserLinks } from '../lib/api';
import { useToast, ToastContainer } from '../components/Toast';
import ExportEmailsButton from '../components/ExportEmailsButton';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { toasts, success, error } = useToast();

  // State for link creation
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [title, setTitle] = useState('');
  const [emailCollectionEnabled, setEmailCollectionEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<Link | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);

  // Load user links on component mount
  useEffect(() => {
    const loadLinks = async () => {
      if (user?.id) {
        try {
          console.log('Loading links for user:', user.id);
          const userLinks = await getUserLinks(user.id);
          console.log('Loaded links:', userLinks);
          setLinks(userLinks);
        } catch (error) {
          console.error('Error loading links:', error);
          error('Failed to load links');
        } finally {
          setLoadingLinks(false);
        }
      } else {
        setLoadingLinks(false);
      }
    };

    loadLinks();
  }, [user?.id]);

  // Calculate stats from actual data
  const stats = {
    totalLinks: links.length,
    totalClicks: links.reduce((sum, link) => sum + link.totalClicks, 0),
    uniqueClicks: links.reduce((sum, link) => sum + link.uniqueClicks, 0),
    countries: new Set(links.map(link => 'US')).size // Mock data for now
  };

  // Validate URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Generate short code
  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  // Handle link creation
  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!originalUrl || !isValidUrl(originalUrl)) {
      error('Please enter a valid URL');
      return;
    }

    if (!user?.id) {
      error('You must be logged in to create links');
      return;
    }

    setIsLoading(true);

    try {
      const request: CreateLinkRequest = {
        originalUrl,
        customAlias: customAlias || undefined,
        title: title || undefined,
        emailCollectionEnabled
      };

      console.log('Creating link with request:', request);
      const response = await createLink(request, user.id);
      console.log('Create link response:', response);

      if (response.success && response.link) {
        setLinks(prev => [response.link!, ...prev]);
        setCreatedLink(response.link);
        success('Link created successfully!');

        // Reset form
        setOriginalUrl('');
        setCustomAlias('');
        setTitle('');
        setEmailCollectionEnabled(false);
      } else {
        console.error('Create link failed:', response.error);
        error(response.error || 'Failed to create link');
      }

    } catch (err) {
      console.error('Error creating link:', err);
      error('Failed to create link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      success('Copied to clipboard!');
    } catch (err) {
      error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <ToastContainer toasts={toasts} />
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <LinkIcon className="w-6 h-6 text-white" />
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-2xl font-bold text-white hover:text-gray-300 transition-colors"
              >
                Linkly
              </button>
            </div>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10"
                }
              }}
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your links and track their performance
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Links</p>
                <p className="text-2xl font-bold">{stats.totalLinks}</p>
              </div>
              <LinkIcon className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Clicks</p>
                <p className="text-2xl font-bold">{stats.totalClicks}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Unique Clicks</p>
                <p className="text-2xl font-bold">{stats.uniqueClicks}</p>
              </div>
              <QrCode className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Countries</p>
                <p className="text-2xl font-bold">{stats.countries}</p>
              </div>
              <Globe className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        {createdLink && (
          <div className="bg-green-900/50 border border-green-700 rounded-2xl p-6 mb-8">
            <h3 className="text-green-400 font-semibold mb-4">✅ Link Created Successfully!</h3>
            <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-400 text-sm">Your short link:</p>
                <p className="text-white font-mono text-lg">https://trackerr.pro/{createdLink.shortCode}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(`https://trackerr.pro/${createdLink.shortCode}`)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={`https://trackerr.pro/${createdLink.shortCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Open link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Create Link Section */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {links.length === 0 ? 'Create Your First Link' : 'Create New Link'}
          </h2>
          <form onSubmit={handleCreateLink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Destination URL *
              </label>
              <input
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My awesome link"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Custom Back-half (Optional)
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-3 bg-gray-700 border border-r-0 border-gray-600 rounded-l-lg text-gray-300 text-sm">
                  trackerr.pro/
                </span>
                <input
                  type="text"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="my-custom-link"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-r-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">Leave empty for auto-generated short code</p>
            </div>

            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    📧 Email Collection
                  </label>
                  <p className="text-gray-500 text-xs">
                    Show a popup to collect visitor emails before redirecting
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailCollectionEnabled}
                    onChange={(e) => setEmailCollectionEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Link'}
            </button>
          </form>
        </div>

        {/* Recent Links */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Links</h2>
            <ExportEmailsButton />
          </div>

          {loadingLinks ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your links...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-12">
              <LinkIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No links created yet</p>
              <p className="text-gray-500">Create your first link to get started with tracking</p>
            </div>
          ) : (
            <div className="space-y-4">
              {links.map((link) => (
                <div key={link.id} className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold">
                          {link.title || 'Untitled Link'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          link.isActive
                            ? 'bg-green-900 text-green-400'
                            : 'bg-red-900 text-red-400'
                        }`}>
                          {link.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm">Short URL:</span>
                          <code className="text-blue-400 bg-gray-900 px-2 py-1 rounded text-sm">
                            https://trackerr.pro/{link.shortCode}
                          </code>
                          <button
                            onClick={() => copyToClipboard(`https://trackerr.pro/${link.shortCode}`)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            title="Copy to clipboard"
                          >
                            <Copy className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm">Destination:</span>
                          <a
                            href={link.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-white text-sm truncate max-w-md"
                          >
                            {link.originalUrl}
                          </a>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>Created: {link.createdAt.toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{link.totalClicks} clicks</span>
                          <span>•</span>
                          <span>{link.uniqueClicks} unique</span>
                          {link.emailCaptures > 0 && (
                            <>
                              <span>•</span>
                              <span>{link.emailCaptures} emails</span>
                            </>
                          )}
                          {link.emailCollectionEnabled && (
                            <>
                              <span>•</span>
                              <span className="text-green-400">📧 Email Collection ON</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => window.open(`https://trackerr.pro/${link.shortCode}`, '_blank')}
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        title="Visit link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/analytics/${link.id}`)}
                        className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                        title="View analytics"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
