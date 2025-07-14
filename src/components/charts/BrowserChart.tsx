import React from 'react';
import { Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

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
      {sortedBrowsers.map(([browser, clicks], index) => {
        const percentage = ((clicks / totalClicks) * 100).toFixed(1);
        const maxClicks = Math.max(...Object.values(data));
        const progressValue = (clicks / maxClicks) * 100;

        return (
          <div key={browser} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/70 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-700 rounded-lg">
                  {browserIcons[browser] || <Globe className="w-5 h-5 text-gray-300" />}
                </div>
                <div>
                  <p className="font-semibold text-white">{browser}</p>
                  <p className="text-sm text-gray-400">{clicks.toLocaleString()} clicks</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-white">{percentage}%</div>
                <div className="text-xs text-gray-500">#{index + 1}</div>
              </div>
            </div>

            <Progress
              value={progressValue}
            />
          </div>
        );
      })}
    </div>
  );
};

export default BrowserChart;
