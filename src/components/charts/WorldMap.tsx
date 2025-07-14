import React, { useState } from 'react';

interface WorldMapProps {
  data: Record<string, number>;
  totalClicks: number;
}

// Country flag emojis for visual representation
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
  'Russia': '🇷🇺',
  'Italy': '🇮🇹',
  'Spain': '🇪🇸',
  'Netherlands': '🇳🇱',
  'Sweden': '🇸🇪',
  'Norway': '🇳🇴',
  'Denmark': '🇩🇰',
  'Finland': '🇫🇮',
  'Switzerland': '🇨🇭',
  'Austria': '🇦🇹',
  'Belgium': '🇧🇪',
  'Portugal': '🇵🇹',
  'Poland': '🇵🇱',
  'Czech Republic': '🇨🇿',
  'Hungary': '🇭🇺',
  'Greece': '🇬🇷',
  'Turkey': '🇹🇷',
  'South Korea': '🇰🇷',
  'Singapore': '🇸🇬',
  'Thailand': '🇹🇭',
  'Vietnam': '🇻🇳',
  'Philippines': '🇵🇭',
  'Indonesia': '🇮🇩',
  'Malaysia': '🇲🇾',
  'Mexico': '🇲🇽',
  'Argentina': '🇦🇷',
  'Chile': '🇨🇱',
  'Colombia': '🇨🇴',
  'Peru': '🇵🇪',
  'South Africa': '🇿🇦',
  'Egypt': '🇪🇬',
  'Nigeria': '🇳🇬',
  'Kenya': '🇰🇪',
  'Morocco': '🇲🇦',
  'Israel': '🇮🇱',
  'UAE': '🇦🇪',
  'Saudi Arabia': '🇸🇦',
  'Unknown': '🌍',
  'Local': '🏠'
};

const InteractiveWorldMap: React.FC<WorldMapProps> = ({ data, totalClicks }) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const sortedCountries = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const maxClicks = Math.max(...Object.values(data));

  const getColor = (clicks: number) => {
    const ratio = clicks / maxClicks;
    if (ratio > 0.7) return 'bg-green-500'; // most users
    if (ratio > 0.4) return 'bg-lime-500'; // high users
    if (ratio > 0.2) return 'bg-yellow-500'; // medium users
    return 'bg-red-500'; // least users
  };

  return (
    <div className="w-full h-96 bg-gray-900 rounded-xl overflow-hidden border border-gray-700 relative">
      {/* Simple World Map Visualization */}
      <div className="w-full h-full p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">Global User Distribution</h3>
            <p className="text-gray-400 text-sm">Click data from {Object.keys(data).length} countries</p>
          </div>

          {/* World Icon with Stats */}
          <div className="relative mb-6">
            <div className="w-32 h-32 mx-auto bg-gray-800 rounded-full flex items-center justify-center border-4 border-gray-700">
              <div className="text-center">
                <div className="text-4xl mb-1">🌍</div>
                <div className="text-lg font-bold text-white">{totalClicks.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Total Clicks</div>
              </div>
            </div>

            {/* Animated Rings */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-2 border-green-500/20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </div>

          {/* Top Countries Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-md mx-auto">
            {sortedCountries.slice(0, 6).map(([country, clicks]) => (
              <div
                key={country}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 hover:bg-gray-800/70 transition-colors cursor-pointer"
                onMouseEnter={() => setHoveredCountry(country)}
                onMouseLeave={() => setHoveredCountry(null)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{countryFlags[country] || '🌍'}</div>
                  <div className="text-sm font-semibold text-white truncate">{country}</div>
                  <div className="text-xs text-gray-400">{clicks.toLocaleString()}</div>
                  <div className={`w-full h-1 rounded-full mt-2 ${getColor(clicks)}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-600">
        <h4 className="text-white text-sm font-semibold mb-2">User Distribution</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-300 text-xs">Most Users</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-lime-500"></div>
            <span className="text-gray-300 text-xs">High Users</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-300 text-xs">Medium Users</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-300 text-xs">Least Users</span>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="absolute top-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-600">
        <div className="text-white text-sm">
          <div className="font-semibold">{Object.keys(data).length} Countries</div>
          <div className="text-gray-300 text-xs">{totalClicks.toLocaleString()} Total Clicks</div>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredCountry && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 shadow-lg pointer-events-none z-10">
          {hoveredCountry}: {data[hoveredCountry]?.toLocaleString()} clicks
        </div>
      )}
    </div>
  );
};

export default InteractiveWorldMap;
