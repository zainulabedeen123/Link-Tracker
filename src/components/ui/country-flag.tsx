import React from 'react';

interface CountryFlagProps {
  country: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Comprehensive country flag mapping
const countryFlags: Record<string, string> = {
  // Major Countries
  'United States': '🇺🇸',
  'United Kingdom': '🇬🇧',
  'Germany': '🇩🇪',
  'France': '🇫🇷',
  'Japan': '🇯🇵',
  'Australia': '🇦🇺',
  'Canada': '🇨🇦',
  'India': '🇮🇳',
  'Brazil': '🇧🇷',
  'China': '🇨🇳',
  'Russia': '🇷🇺',
  'Italy': '🇮🇹',
  'Spain': '🇪🇸',
  'Netherlands': '🇳🇱',
  'Sweden': '🇸🇪',
  'Norway': '🇳🇴',
  'Denmark': '🇩🇰',
  'Finland': '🇫🇮',
  'Switzerland': '🇨🇭',
  'Austria': '🇦🇹',
  'Belgium': '🇧🇪',
  'Portugal': '🇵🇹',
  'Poland': '🇵🇱',
  'Czech Republic': '🇨🇿',
  'Hungary': '🇭🇺',
  'Greece': '🇬🇷',
  'Turkey': '🇹🇷',
  'South Korea': '🇰🇷',
  'Singapore': '🇸🇬',
  'Thailand': '🇹🇭',
  'Vietnam': '🇻🇳',
  'Philippines': '🇵🇭',
  'Indonesia': '🇮🇩',
  'Malaysia': '🇲🇾',
  'Mexico': '🇲🇽',
  'Argentina': '🇦🇷',
  'Chile': '🇨🇱',
  'Colombia': '🇨🇴',
  'Peru': '🇵🇪',
  'South Africa': '🇿🇦',
  'Egypt': '🇪🇬',
  'Nigeria': '🇳🇬',
  'Kenya': '🇰🇪',
  'Morocco': '🇲🇦',
  'Israel': '🇮🇱',
  'UAE': '🇦🇪',
  'Saudi Arabia': '🇸🇦',
  
  // European Countries
  'Ireland': '🇮🇪',
  'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
  'Iceland': '🇮🇸',
  'Luxembourg': '🇱🇺',
  'Slovenia': '🇸🇮',
  'Slovakia': '🇸🇰',
  'Croatia': '🇭🇷',
  'Serbia': '🇷🇸',
  'Bulgaria': '🇧🇬',
  'Romania': '🇷🇴',
  'Lithuania': '🇱🇹',
  'Latvia': '🇱🇻',
  'Estonia': '🇪🇪',
  'Malta': '🇲🇹',
  'Cyprus': '🇨🇾',
  
  // Asian Countries
  'Taiwan': '🇹🇼',
  'Hong Kong': '🇭🇰',
  'Macau': '🇲🇴',
  'Mongolia': '🇲🇳',
  'Kazakhstan': '🇰🇿',
  'Uzbekistan': '🇺🇿',
  'Pakistan': '🇵🇰',
  'Bangladesh': '🇧🇩',
  'Sri Lanka': '🇱🇰',
  'Myanmar': '🇲🇲',
  'Cambodia': '🇰🇭',
  'Laos': '🇱🇦',
  'Nepal': '🇳🇵',
  'Bhutan': '🇧🇹',
  'Maldives': '🇲🇻',
  
  // Middle East
  'Iran': '🇮🇷',
  'Iraq': '🇮🇶',
  'Jordan': '🇯🇴',
  'Lebanon': '🇱🇧',
  'Syria': '🇸🇾',
  'Kuwait': '🇰🇼',
  'Qatar': '🇶🇦',
  'Bahrain': '🇧🇭',
  'Oman': '🇴🇲',
  'Yemen': '🇾🇪',
  
  // African Countries
  'Algeria': '🇩🇿',
  'Tunisia': '🇹🇳',
  'Libya': '🇱🇾',
  'Sudan': '🇸🇩',
  'Ethiopia': '🇪🇹',
  'Ghana': '🇬🇭',
  'Ivory Coast': '🇨🇮',
  'Senegal': '🇸🇳',
  'Mali': '🇲🇱',
  'Burkina Faso': '🇧🇫',
  'Niger': '🇳🇪',
  'Chad': '🇹🇩',
  'Cameroon': '🇨🇲',
  'Central African Republic': '🇨🇫',
  'Democratic Republic of Congo': '🇨🇩',
  'Republic of Congo': '🇨🇬',
  'Gabon': '🇬🇦',
  'Equatorial Guinea': '🇬🇶',
  'Angola': '🇦🇴',
  'Zambia': '🇿🇲',
  'Zimbabwe': '🇿🇼',
  'Botswana': '🇧🇼',
  'Namibia': '🇳🇦',
  'Lesotho': '🇱🇸',
  'Swaziland': '🇸🇿',
  'Madagascar': '🇲🇬',
  'Mauritius': '🇲🇺',
  'Seychelles': '🇸🇨',
  
  // Americas
  'Venezuela': '🇻🇪',
  'Guyana': '🇬🇾',
  'Suriname': '🇸🇷',
  'French Guiana': '🇬🇫',
  'Uruguay': '🇺🇾',
  'Paraguay': '🇵🇾',
  'Bolivia': '🇧🇴',
  'Ecuador': '🇪🇨',
  'Panama': '🇵🇦',
  'Costa Rica': '🇨🇷',
  'Nicaragua': '🇳🇮',
  'Honduras': '🇭🇳',
  'El Salvador': '🇸🇻',
  'Guatemala': '🇬🇹',
  'Belize': '🇧🇿',
  'Jamaica': '🇯🇲',
  'Haiti': '🇭🇹',
  'Dominican Republic': '🇩🇴',
  'Cuba': '🇨🇺',
  'Bahamas': '🇧🇸',
  'Barbados': '🇧🇧',
  'Trinidad and Tobago': '🇹🇹',
  
  // Oceania
  'New Zealand': '🇳🇿',
  'Papua New Guinea': '🇵🇬',
  'Fiji': '🇫🇯',
  'Solomon Islands': '🇸🇧',
  'Vanuatu': '🇻🇺',
  'Samoa': '🇼🇸',
  'Tonga': '🇹🇴',
  'Palau': '🇵🇼',
  'Marshall Islands': '🇲🇭',
  'Micronesia': '🇫🇲',
  'Kiribati': '🇰🇮',
  'Tuvalu': '🇹🇻',
  'Nauru': '🇳🇷',
  
  // Special cases
  'Unknown': '🌍',
  'Local': '🏠',
  'Private': '🔒',
  'Anonymous': '❓',
};

const CountryFlag: React.FC<CountryFlagProps> = ({ 
  country, 
  size = 'md', 
  className = '' 
}) => {
  const flag = countryFlags[country] || countryFlags['Unknown'];
  
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <span 
      className={`inline-block ${sizeClasses[size]} ${className}`}
      title={country}
      role="img"
      aria-label={`Flag of ${country}`}
    >
      {flag}
    </span>
  );
};

export default CountryFlag;
