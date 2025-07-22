import React from 'react';
import { Calendar, Clock, TrendingUp, Activity } from 'lucide-react';

interface TimeChartProps {
  data: Record<string, number>;
  totalClicks: number;
}

const TimeChart: React.FC<TimeChartProps> = ({ data, totalClicks }) => {
  // Sort dates and get last 7 days
  const sortedDates = Object.entries(data)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .slice(-7);

  const maxClicks = Math.max(...Object.values(data));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="space-y-6">
      {/* Line Chart */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="relative h-48">
          {/* Chart Area */}
          <div className="relative w-full h-40">
            {/* Grid Lines */}
            <div className="absolute inset-0">
              {[0, 25, 50, 75, 100].map((percent) => (
                <div
                  key={percent}
                  className="absolute w-full border-t border-gray-700/50"
                  style={{ top: `${100 - percent}%` }}
                />
              ))}
            </div>

            {/* Y-axis labels */}
            <div className="absolute -left-8 inset-y-0 flex flex-col justify-between text-xs text-gray-400">
              <span>{maxClicks}</span>
              <span>{Math.round(maxClicks * 0.75)}</span>
              <span>{Math.round(maxClicks * 0.5)}</span>
              <span>{Math.round(maxClicks * 0.25)}</span>
              <span>0</span>
            </div>

            {/* Line Chart SVG */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Line Path */}
              <path
                d={sortedDates.map(([date, clicks], index) => {
                  const x = (index / (sortedDates.length - 1)) * 100;
                  const y = 100 - (maxClicks > 0 ? (clicks / maxClicks) * 100 : 0);
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke="rgb(34, 197, 94)"
                strokeWidth="0.5"
                className="drop-shadow-sm"
              />

              {/* Area Fill */}
              <path
                d={[
                  ...sortedDates.map(([date, clicks], index) => {
                    const x = (index / (sortedDates.length - 1)) * 100;
                    const y = 100 - (maxClicks > 0 ? (clicks / maxClicks) * 100 : 0);
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }),
                  `L 100 100 L 0 100 Z`
                ].join(' ')}
                fill="url(#gradient)"
                opacity="0.2"
              />

              {/* Data Points */}
              {sortedDates.map(([date, clicks], index) => {
                const x = (index / (sortedDates.length - 1)) * 100;
                const y = 100 - (maxClicks > 0 ? (clicks / maxClicks) * 100 : 0);
                return (
                  <circle
                    key={date}
                    cx={x}
                    cy={y}
                    r="1"
                    fill="rgb(34, 197, 94)"
                    className="hover:r-2 transition-all cursor-pointer"
                  />
                );
              })}

              {/* Gradient Definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between mt-4 text-xs text-gray-400">
            {sortedDates.map(([date]) => (
              <div key={date} className="text-center">
                <div className="font-semibold">{getDayName(date)}</div>
                <div>{formatDate(date)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-gray-300">Today</span>
          </div>
          <div className="text-xl font-bold text-white">
            {data[new Date().toISOString().split('T')[0]] || 0}
          </div>
          <div className="text-xs text-gray-400">clicks</div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-gray-300">Peak Day</span>
          </div>
          <div className="text-xl font-bold text-white">
            {Math.max(...Object.values(data))}
          </div>
          <div className="text-xs text-gray-400">clicks</div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-gray-300">Average</span>
          </div>
          <div className="text-xl font-bold text-white">
            {Object.keys(data).length > 0 ? Math.round(totalClicks / Object.keys(data).length) : 0}
          </div>
          <div className="text-xs text-gray-400">per day</div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold text-gray-300">Active Days</span>
          </div>
          <div className="text-xl font-bold text-white">
            {Object.values(data).filter(clicks => clicks > 0).length}
          </div>
          <div className="text-xs text-gray-400">days</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h5 className="font-semibold mb-4 flex items-center gap-2 text-white">
          <Clock className="w-4 h-4 text-gray-400" />
          Recent Activity
        </h5>

        <div className="space-y-2">
          {sortedDates.slice(-5).reverse().map(([date, clicks]) => (
            <div key={date} className="flex items-center justify-between py-2 px-3 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-300">{formatDate(date)}</span>
              </div>
              <span className="text-sm font-semibold text-white">{clicks} clicks</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeChart;
