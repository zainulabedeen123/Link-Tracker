import React from 'react';
import { MapPin, TrendingUp } from 'lucide-react';

interface CountryChartProps {
  data: Record<string, number>;
  totalClicks: number;
}

const CountryChart: React.FC<CountryChartProps> = ({ data, totalClicks }) => {
  // Sort countries by clicks and get top 10
  const sortedCountries = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const maxClicks = Math.max(...Object.values(data));

  // Country flag emojis mapping
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

  return (
    <div className="space-y-4">
      {/* Top Countries List */}
      <div className="space-y-3">
        {sortedCountries.map(([country, clicks], index) => {
          const percentage = ((clicks / totalClicks) * 100).toFixed(1);
          const barWidth = (clicks / maxClicks) * 100;
          
          return (
            <div key={country} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{countryFlags[country] || '🌍'}</span>
                  <div>
                    <p className="font-semibold text-white">{country}</p>
                    <p className="text-xs text-gray-400">
                      {clicks.toLocaleString()} clicks • {percentage}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-400">#{index + 1}</span>
                  {index === 0 && <TrendingUp className="w-4 h-4 text-green-400" />}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${barWidth}%` }}
                />
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse" />
              </div>
            </div>
          );
        })}
      </div>

      {/* World Map Visualization (Simplified) */}
      <div className="mt-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          Global Reach
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sortedCountries.slice(0, 6).map(([country, clicks]) => (
            <div key={country} className="text-center p-3 bg-gray-900/50 rounded-lg border border-gray-600">
              <div className="text-3xl mb-2">{countryFlags[country] || '🌍'}</div>
              <div className="text-sm font-semibold text-white">{country}</div>
              <div className="text-xs text-gray-400">{clicks} clicks</div>
            </div>
          ))}
        </div>
        
        {Object.keys(data).length > 6 && (
          <div className="text-center mt-4 text-gray-400 text-sm">
            +{Object.keys(data).length - 6} more countries
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{Object.keys(data).length}</div>
            <div className="text-sm text-gray-300">Countries Reached</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-xl p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {sortedCountries.length > 0 ? sortedCountries[0][0] : 'N/A'}
            </div>
            <div className="text-sm text-gray-300">Top Country</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryChart;
