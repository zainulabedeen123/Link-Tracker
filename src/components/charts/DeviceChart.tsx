import React from 'react';
import { Smartphone, Monitor, Tablet, Laptop } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

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

  // Prepare data for pie chart
  const pieData = sortedDevices.map(([device, clicks]) => ({
    name: device,
    value: clicks,
    percentage: ((clicks / totalClicks) * 100).toFixed(1),
    color: pieColors[device] || '#6b7280'
  }));

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

      {/* Donut Chart Visualization */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold mb-6 text-center text-white">Device Distribution</h4>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                formatter={(value: any, name: any) => [
                  `${value} clicks (${pieData.find(d => d.name === name)?.percentage}%)`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3">
          {sortedDevices.map(([device, clicks]) => {
            const percentage = ((clicks / totalClicks) * 100).toFixed(1);
            
            return (
              <div key={device} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${deviceColors[device] || 'from-gray-500 to-gray-600'}`} />
                <span className="text-sm text-gray-300">{device} ({percentage}%)</span>
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
