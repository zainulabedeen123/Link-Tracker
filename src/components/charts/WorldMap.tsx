import React from 'react';
import WorldMap from 'react-svg-worldmap';

interface WorldMapProps {
  data: Record<string, number>;
  totalClicks: number;
}

// Country code mapping for react-svg-worldmap
const countryCodeMap: Record<string, string> = {
  'United States': 'US',
  'United Kingdom': 'GB',
  'Germany': 'DE',
  'France': 'FR',
  'Japan': 'JP',
  'Australia': 'AU',
  'Canada': 'CA',
  'India': 'IN',
  'Brazil': 'BR',
  'China': 'CN',
  'Russia': 'RU',
  'Italy': 'IT',
  'Spain': 'ES',
  'Netherlands': 'NL',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Switzerland': 'CH',
  'Austria': 'AT',
  'Belgium': 'BE',
  'Portugal': 'PT',
  'Poland': 'PL',
  'Czech Republic': 'CZ',
  'Hungary': 'HU',
  'Greece': 'GR',
  'Turkey': 'TR',
  'South Korea': 'KR',
  'Singapore': 'SG',
  'Thailand': 'TH',
  'Vietnam': 'VN',
  'Philippines': 'PH',
  'Indonesia': 'ID',
  'Malaysia': 'MY',
  'Mexico': 'MX',
  'Argentina': 'AR',
  'Chile': 'CL',
  'Colombia': 'CO',
  'Peru': 'PE',
  'South Africa': 'ZA',
  'Egypt': 'EG',
  'Nigeria': 'NG',
  'Kenya': 'KE',
  'Morocco': 'MA',
  'Israel': 'IL',
  'UAE': 'AE',
  'Saudi Arabia': 'SA',
  'Ireland': 'IE',
  'Scotland': 'GB',
  'Wales': 'GB',
  'Iceland': 'IS',
  'Luxembourg': 'LU',
  'Slovenia': 'SI',
  'Slovakia': 'SK',
  'Croatia': 'HR',
  'Serbia': 'RS',
  'Bulgaria': 'BG',
  'Romania': 'RO',
  'Lithuania': 'LT',
  'Latvia': 'LV',
  'Estonia': 'EE',
  'Malta': 'MT',
  'Cyprus': 'CY',
  'Taiwan': 'TW',
  'Hong Kong': 'HK',
  'Macau': 'MO',
  'Mongolia': 'MN',
  'Kazakhstan': 'KZ',
  'Uzbekistan': 'UZ',
  'Pakistan': 'PK',
  'Bangladesh': 'BD',
  'Sri Lanka': 'LK',
  'Myanmar': 'MM',
  'Cambodia': 'KH',
  'Laos': 'LA',
  'Nepal': 'NP',
  'Bhutan': 'BT',
  'Maldives': 'MV',
  'Iran': 'IR',
  'Iraq': 'IQ',
  'Jordan': 'JO',
  'Lebanon': 'LB',
  'Syria': 'SY',
  'Kuwait': 'KW',
  'Qatar': 'QA',
  'Bahrain': 'BH',
  'Oman': 'OM',
  'Yemen': 'YE',
  'Algeria': 'DZ',
  'Tunisia': 'TN',
  'Libya': 'LY',
  'Sudan': 'SD',
  'Ethiopia': 'ET',
  'Ghana': 'GH',
  'New Zealand': 'NZ',
};

const InteractiveWorldMap: React.FC<WorldMapProps> = ({ data, totalClicks }) => {

  // Convert data to the format expected by react-svg-worldmap
  const mapData = Object.entries(data)
    .map(([country, clicks]) => {
      const countryCode = countryCodeMap[country];
      if (!countryCode || clicks === 0) return null;
      return {
        country: countryCode,
        value: clicks
      };
    })
    .filter(Boolean) as Array<{ country: string; value: number }>;

  const maxClicks = Math.max(...Object.values(data));

  const getColor = (value: number) => {
    const ratio = value / maxClicks;
    if (ratio > 0.7) return '#22c55e'; // green-500 (most users)
    if (ratio > 0.4) return '#84cc16'; // lime-500 (high users)
    if (ratio > 0.2) return '#eab308'; // yellow-500 (medium users)
    return '#ef4444'; // red-500 (least users)
  };

  return (
    <div className="w-full h-96 bg-gray-900 rounded-xl overflow-hidden border border-gray-700 relative">
      <div className="w-full h-full p-4">
        <WorldMap
          color="#374151"
          title=""
          value-suffix="clicks"
          size="responsive"
          data={mapData}
          backgroundColor="#1f2937"
          strokeOpacity={0.3}
          borderColor="#4b5563"
          tooltipBgColor="#1f2937"
          tooltipTextColor="#ffffff"
          richInteraction
          styleFunction={(context: any) => {
            const { countryValue } = context;
            return {
              fill: countryValue ? getColor(countryValue) : '#374151',
              fillOpacity: countryValue ? 0.8 : 0.3,
              stroke: '#4b5563',
              strokeWidth: 1,
              strokeOpacity: 0.5,
              cursor: 'pointer'
            };
          }}
        />
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-600">
        <h4 className="text-white text-sm font-semibold mb-2">User Distribution</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-300 text-xs">Most Users</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-lime-500"></div>
            <span className="text-gray-300 text-xs">High Users</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-300 text-xs">Medium Users</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-300 text-xs">Least Users</span>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="absolute top-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-600">
        <div className="text-white text-sm">
          <div className="font-semibold">{Object.keys(data).length} Countries</div>
          <div className="text-gray-300 text-xs">{totalClicks.toLocaleString()} Total Clicks</div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveWorldMap;
