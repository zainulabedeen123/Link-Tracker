import React from 'react';
import { Smartphone, Monitor, Tablet, Laptop } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

interface DeviceChartProps {
  data: Record<string, number>;
  totalClicks: number;
}

const DeviceChart: React.FC<DeviceChartProps> = ({ data, totalClicks }) => {
  const deviceIcons: Record<string, React.ReactNode> = {
    'Mobile': <Smartphone className="w-6 h-6" />,
    'Desktop': <Monitor className="w-6 h-6" />,
    'Tablet': <Tablet className="w-6 h-6" />,
    'Laptop': <Laptop className="w-6 h-6" />,
  };

  const deviceColors: Record<string, string> = {
    'Mobile': 'from-green-500 to-emerald-600',
    'Desktop': 'from-blue-500 to-cyan-600',
    'Tablet': 'from-purple-500 to-violet-600',
    'Laptop': 'from-orange-500 to-amber-600',
  };

  const pieColors: Record<string, string> = {
    'Mobile': '#22c55e',
    'Desktop': '#3b82f6',
    'Tablet': '#8b5cf6',
    'Laptop': '#f97316',
  };

  const sortedDevices = Object.entries(data)
    .sort(([, a], [, b]) => b - a);

  const maxClicks = Math.max(...Object.values(data));

  return (
    <div className="space-y-6">
      {/* Device Breakdown */}
      <div className="space-y-4">
        {sortedDevices.map(([device, clicks]) => {
          const percentage = ((clicks / totalClicks) * 100).toFixed(1);
          const progressValue = (clicks / maxClicks) * 100;

          return (
            <div key={device} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/70 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-700 rounded-lg">
                    {deviceIcons[device] || <Monitor className="w-5 h-5 text-gray-300" />}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{device}</p>
                    <p className="text-sm text-gray-400">
                      {clicks.toLocaleString()} clicks • {percentage}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{percentage}%</div>
                </div>
              </div>

              <Progress
                value={progressValue}
              />
            </div>
          );
        })}
      </div>

      {/* Simple Donut Chart Visualization */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold mb-6 text-center text-white">Device Distribution</h4>

        {/* Simple Donut Chart using CSS */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          {/* Background Circle */}
          <div className="absolute inset-0 rounded-full bg-gray-700"></div>

          {/* Center Circle with Stats */}
          <div className="absolute inset-8 rounded-full bg-gray-900 flex items-center justify-center border-4 border-gray-800">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{totalClicks.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Total Clicks</div>
            </div>
          </div>

          {/* Device Segments */}
          {sortedDevices.map(([device, clicks], index) => {
            const percentage = (clicks / totalClicks) * 100;
            const startAngle = sortedDevices.slice(0, index).reduce((acc, [, c]) => acc + (c / totalClicks) * 360, 0);
            const endAngle = startAngle + (percentage * 3.6);

            return (
              <div
                key={device}
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(from ${startAngle}deg, transparent 0deg, ${pieColors[device] || '#6b7280'} 0deg, ${pieColors[device] || '#6b7280'} ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`,
                  mask: 'radial-gradient(circle at center, transparent 32px, black 32px)',
                  WebkitMask: 'radial-gradient(circle at center, transparent 32px, black 32px)'
                }}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3">
          {sortedDevices.map(([device, clicks]) => {
            const percentage = ((clicks / totalClicks) * 100).toFixed(1);

            return (
              <div key={device} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: pieColors[device] || '#6b7280' }}
                />
                <div className="text-sm">
                  <div className="text-white font-medium">{device}</div>
                  <div className="text-gray-400 text-xs">{percentage}% • {clicks.toLocaleString()}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile vs Desktop Comparison */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Smartphone className="w-5 h-5 text-green-400" />
            <span className="font-semibold text-green-300">Mobile</span>
          </div>
          <div className="text-2xl font-bold text-green-400">
            {((((data.Mobile || 0) + (data.Tablet || 0)) / totalClicks) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-green-300">Mobile + Tablet</div>
        </div>

        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Monitor className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-blue-300">Desktop</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">
            {((((data.Desktop || 0) + (data.Laptop || 0)) / totalClicks) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-blue-300">Desktop + Laptop</div>
        </div>
      </div>
    </div>
  );
};

export default DeviceChart;
