import React from 'react';
import { Globe } from 'lucide-react';

interface BrowserChartProps {
  data: Record<string, number>;
  totalClicks: number;
}

const BrowserChart: React.FC<BrowserChartProps> = ({ data, totalClicks }) => {
  const browserIcons: Record<string, React.ReactNode> = {
    'Chrome': <Globe className="w-5 h-5" />,
    'Firefox': <Globe className="w-5 h-5" />,
    'Safari': <Globe className="w-5 h-5" />,
    'Edge': <Globe className="w-5 h-5" />,
    'Opera': <Globe className="w-5 h-5" />,
  };

  const browserColors: Record<string, string> = {
    'Chrome': 'from-yellow-400 to-red-500',
    'Firefox': 'from-orange-500 to-red-600',
    'Safari': 'from-blue-400 to-cyan-500',
    'Edge': 'from-blue-600 to-indigo-700',
    'Opera': 'from-red-500 to-pink-600',
    'Unknown': 'from-gray-500 to-gray-600',
  };

  const sortedBrowsers = Object.entries(data)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5 text-purple-400" />
        Browser Usage
      </h4>
      
      {sortedBrowsers.map(([browser, clicks], index) => {
        const percentage = ((clicks / totalClicks) * 100).toFixed(1);
        
        return (
          <div key={browser} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${browserColors[browser] || 'from-gray-500 to-gray-600'}`}>
                {browserIcons[browser] || <Globe className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-semibold text-white">{browser}</p>
                <p className="text-sm text-gray-400">{clicks} clicks</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-white">{percentage}%</div>
              <div className="text-xs text-gray-400">#{index + 1}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BrowserChart;
