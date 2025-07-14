import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps';

interface WorldMapProps {
  data: Record<string, number>;
  totalClicks: number;
}

// Country coordinates for markers
const countryCoordinates: Record<string, [number, number]> = {
  'United States': [-95.7129, 37.0902],
  'United Kingdom': [-3.4360, 55.3781],
  'Germany': [10.4515, 51.1657],
  'France': [2.2137, 46.2276],
  'Japan': [138.2529, 36.2048],
  'Australia': [133.7751, -25.2744],
  'Canada': [-106.3468, 56.1304],
  'India': [78.9629, 20.5937],
  'Brazil': [-51.9253, -14.2350],
  'China': [104.1954, 35.8617],
  'Russia': [105.3188, 61.5240],
  'Italy': [12.5674, 41.8719],
  'Spain': [-3.7492, 40.4637],
  'Netherlands': [5.2913, 52.1326],
  'Sweden': [18.6435, 60.1282],
  'Norway': [8.4689, 60.4720],
  'Denmark': [9.5018, 56.2639],
  'Finland': [25.7482, 61.9241],
  'Switzerland': [8.2275, 46.8182],
  'Austria': [14.5501, 47.5162],
  'Belgium': [4.4699, 50.5039],
  'Portugal': [-8.2245, 39.3999],
  'Poland': [19.1343, 51.9194],
  'Czech Republic': [15.4730, 49.8175],
  'Hungary': [19.5033, 47.1625],
  'Greece': [21.8243, 39.0742],
  'Turkey': [35.2433, 38.9637],
  'South Korea': [127.7669, 35.9078],
  'Singapore': [103.8198, 1.3521],
  'Thailand': [100.9925, 15.8700],
  'Vietnam': [108.2772, 14.0583],
  'Philippines': [121.7740, 12.8797],
  'Indonesia': [113.9213, -0.7893],
  'Malaysia': [101.9758, 4.2105],
  'Mexico': [-102.5528, 23.6345],
  'Argentina': [-63.6167, -38.4161],
  'Chile': [-71.5430, -35.6751],
  'Colombia': [-74.2973, 4.5709],
  'Peru': [-75.0152, -9.1900],
  'South Africa': [22.9375, -30.5595],
  'Egypt': [30.8025, 26.8206],
  'Nigeria': [8.6753, 9.0820],
  'Kenya': [37.9062, -0.0236],
  'Morocco': [-7.0926, 31.7917],
  'Israel': [34.8516, 32.4279],
  'UAE': [53.8478, 23.4241],
  'Saudi Arabia': [45.0792, 23.8859],
};

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@3/countries-110m.json";

const WorldMap: React.FC<WorldMapProps> = ({ data, totalClicks }) => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  const maxClicks = Math.max(...Object.values(data));

  const getMarkerSize = (clicks: number) => {
    const minSize = 4;
    const maxSize = 20;
    const ratio = clicks / maxClicks;
    return minSize + (maxSize - minSize) * ratio;
  };

  const getMarkerColor = (clicks: number) => {
    const ratio = clicks / maxClicks;
    if (ratio > 0.7) return '#ef4444'; // red-500
    if (ratio > 0.4) return '#f97316'; // orange-500
    if (ratio > 0.2) return '#eab308'; // yellow-500
    return '#22c55e'; // green-500
  };

  const handleMoveEnd = (position: any) => {
    setPosition(position);
  };

  return (
    <div className="w-full h-96 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 100,
          center: [0, 20]
        }}
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates as [number, number]}
          onMoveEnd={handleMoveEnd}
          minZoom={0.5}
          maxZoom={8}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.NAME;
                const clicks = data[countryName] || 0;
                const hasData = clicks > 0;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      setTooltipContent(`${countryName}: ${clicks} clicks`);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent('');
                    }}
                    style={{
                      default: {
                        fill: hasData ? '#e5e7eb' : '#f3f4f6',
                        outline: 'none',
                        stroke: '#d1d5db',
                        strokeWidth: 0.5,
                      },
                      hover: {
                        fill: hasData ? '#d1d5db' : '#e5e7eb',
                        outline: 'none',
                        stroke: '#9ca3af',
                        strokeWidth: 1,
                      },
                      pressed: {
                        fill: '#9ca3af',
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Markers for countries with data */}
          {Object.entries(data).map(([country, clicks]) => {
            const coordinates = countryCoordinates[country];
            if (!coordinates || clicks === 0) return null;

            return (
              <Marker key={country} coordinates={coordinates}>
                <circle
                  r={getMarkerSize(clicks)}
                  fill={getMarkerColor(clicks)}
                  stroke="#ffffff"
                  strokeWidth={2}
                  style={{
                    cursor: 'pointer',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                  }}
                  onMouseEnter={() => {
                    setTooltipContent(`${country}: ${clicks.toLocaleString()} clicks`);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent('');
                  }}
                />
                <circle
                  r={getMarkerSize(clicks) + 5}
                  fill={getMarkerColor(clicks)}
                  opacity={0.3}
                  className="animate-ping"
                />
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltipContent && (
        <div className="absolute top-4 left-4 bg-white text-gray-900 px-3 py-2 rounded-lg text-sm border border-gray-300 shadow-lg">
          {tooltipContent}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-300">
        <h4 className="text-gray-900 text-sm font-semibold mb-2">Click Volume</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-700 text-xs">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-700 text-xs">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-700 text-xs">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-700 text-xs">Minimal</span>
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-1">
        <button
          onClick={() => setPosition(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.5, 8) }))}
          className="w-8 h-8 bg-white hover:bg-gray-50 text-gray-900 rounded border border-gray-300 flex items-center justify-center text-sm font-bold shadow-sm"
        >
          +
        </button>
        <button
          onClick={() => setPosition(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.5, 0.5) }))}
          className="w-8 h-8 bg-white hover:bg-gray-50 text-gray-900 rounded border border-gray-300 flex items-center justify-center text-sm font-bold shadow-sm"
        >
          −
        </button>
      </div>
    </div>
  );
};

export default WorldMap;
