import React from 'react';
import { MapPin, TrendingUp, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import CountryFlag from '../ui/country-flag';
import WorldMap from './WorldMap';

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

  return (
    <div className="space-y-8">
      {/* Interactive World Map */}
      <div className="mb-8">
        <WorldMap data={data} totalClicks={totalClicks} />
      </div>

      {/* Top Countries List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Top Countries</h3>
        <div className="space-y-3">
          {sortedCountries.map(([country, clicks], index) => {
            const percentage = ((clicks / totalClicks) * 100).toFixed(1);
            const progressValue = (clicks / maxClicks) * 100;

            return (
              <div key={country} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/70 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <CountryFlag country={country} size="md" />
                    <div>
                      <p className="font-semibold text-white">{country}</p>
                      <p className="text-sm text-gray-400">
                        {clicks.toLocaleString()} clicks • {percentage}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                    {index === 0 && <TrendingUp className="w-4 h-4 text-green-400" />}
                  </div>
                </div>

                <Progress
                  value={progressValue}
                  className="h-2 bg-gray-700"
                />
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{Object.keys(data).length}</div>
            <div className="text-sm text-blue-300">Countries Reached</div>
          </div>

          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {sortedCountries.length > 0 ? sortedCountries[0][0] : 'N/A'}
            </div>
            <div className="text-sm text-green-300">Top Country</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryChart;
