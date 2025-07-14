import React from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { Link as LinkIcon, BarChart3, QrCode, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
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
                <p className="text-2xl font-bold">0</p>
              </div>
              <LinkIcon className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Clicks</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">QR Codes</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <QrCode className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Countries</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <Globe className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Create Link Section */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Create Your First Link</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Destination URL
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Custom Back-half (Optional)
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-3 bg-gray-700 border border-r-0 border-gray-600 rounded-l-lg text-gray-300 text-sm">
                  linkly.com/
                </span>
                <input
                  type="text"
                  placeholder="my-custom-link"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-r-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
              Create Link
            </button>
          </div>
        </div>

        {/* Recent Links */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Recent Links</h2>
          <div className="text-center py-12">
            <LinkIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No links created yet</p>
            <p className="text-gray-500">Create your first link to get started with tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
