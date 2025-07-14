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
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
        <TabsTrigger value="list" className="data-[state=active]:bg-gray-700">
          Country List
        </TabsTrigger>
        <TabsTrigger value="map" className="data-[state=active]:bg-gray-700">
          World Map
        </TabsTrigger>
      </TabsList>

      <TabsContent value="list" className="space-y-4 mt-6">
        {/* Top Countries List */}
        <div className="space-y-3">
          {sortedCountries.map(([country, clicks], index) => {
            const percentage = ((clicks / totalClicks) * 100).toFixed(1);
            const progressValue = (clicks / maxClicks) * 100;

            return (
              <Card key={country} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-4">
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
                      <span className="text-sm font-bold text-blue-400">#{index + 1}</span>
                      {index === 0 && <TrendingUp className="w-4 h-4 text-green-400" />}
                    </div>
                  </div>

                  <Progress
                    value={progressValue}
                    className="h-2 bg-gray-700"
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{Object.keys(data).length}</div>
              <div className="text-sm text-gray-300">Countries Reached</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-blue-600/20 border-green-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {sortedCountries.length > 0 ? sortedCountries[0][0] : 'N/A'}
              </div>
              <div className="text-sm text-gray-300">Top Country</div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="map" className="mt-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Globe className="w-5 h-5 text-blue-400" />
              Interactive World Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WorldMap data={data} totalClicks={totalClicks} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CountryChart;
