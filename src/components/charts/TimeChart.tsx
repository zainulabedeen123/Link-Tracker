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
      {/* Bar Chart */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="flex items-end justify-between h-48 gap-2">
          {sortedDates.map(([date, clicks]) => {
            const height = maxClicks > 0 ? (clicks / maxClicks) * 100 : 0;

            return (
              <div key={date} className="flex-1 flex flex-col items-center">
                <div className="relative w-full flex items-end justify-center h-40">
                  <div
                    className="w-full bg-gray-600 rounded-t-lg transition-all duration-1000 ease-out hover:bg-gray-500 cursor-pointer group"
                    style={{ height: `${height}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {clicks} clicks
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <div className="text-xs font-semibold text-white">{getDayName(date)}</div>
                  <div className="text-xs text-gray-400">{formatDate(date)}</div>
                </div>
              </div>
            );
          })}
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
