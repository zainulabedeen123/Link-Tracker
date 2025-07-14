import React from 'react';
import { Clock, MapPin, Smartphone, Monitor, Tablet, Globe, Wifi, Zap } from 'lucide-react';

interface Click {
  id: string;
  country?: string;
  region?: string;
  city?: string;
  device: string;
  browser: string;
  os: string;
  timestamp: Date;
  isBot: boolean;
}

interface ActivityFeedProps {
  recentClicks: Click[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ recentClicks }) => {
  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      case 'desktop': 
      case 'laptop': return <Monitor className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getLocationString = (click: Click) => {
    const parts = [click.city, click.region, click.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
  };

  const countryFlags: Record<string, string> = {
    'United States': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Japan': '🇯🇵',
    'Australia': '🇦🇺',
    'Canada': '🇨🇦',
    'India': '🇮🇳',
    'Brazil': '🇧🇷',
    'China': '🇨🇳',
    'Unknown': '🌍',
    'Local': '🏠'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live Activity</span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {recentClicks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Wifi className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
            <p className="text-xs">Clicks will appear here in real-time</p>
          </div>
        ) : (
          recentClicks.map((click, index) => (
            <div
              key={click.id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/70 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Location & Flag */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{countryFlags[click.country || 'Unknown'] || '🌍'}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {getLocationString(click)}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getTimeAgo(click.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* Device & Browser Info */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 text-gray-300">
                      {getDeviceIcon(click.device)}
                      <span>{click.device}</span>
                    </div>
                    <div className="text-gray-400">
                      {click.browser} • {click.os}
                    </div>
                    {click.isBot && (
                      <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">
                        Bot
                      </span>
                    )}
                  </div>
                </div>

                {/* Status indicator */}
                <div className="flex flex-col items-end gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-gray-500">#{recentClicks.length - index}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Activity Summary */}
      {recentClicks.length > 0 && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-400">{recentClicks.length}</div>
              <div className="text-xs text-blue-300">Recent Clicks</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">
                {new Set(recentClicks.map(c => c.country)).size}
              </div>
              <div className="text-xs text-green-300">Countries</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">
                {new Set(recentClicks.map(c => c.device)).size}
              </div>
              <div className="text-xs text-purple-300">Devices</div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default ActivityFeed;
