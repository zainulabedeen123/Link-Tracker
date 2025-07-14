// Device and browser detection utilities
export const getDeviceInfo = (userAgent: string) => {
  const ua = userAgent.toLowerCase();
  
  // Detect mobile
  const isMobile = /mobile|android|iphone|ipad|phone|tablet/i.test(ua);
  
  // Detect browser
  let browser = 'Unknown';
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';
  
  // Detect OS
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  // Detect device type
  let device = 'Desktop';
  if (ua.includes('mobile') || ua.includes('phone')) device = 'Mobile';
  else if (ua.includes('tablet') || ua.includes('ipad')) device = 'Tablet';
  
  // Detect bots
  const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
  
  return {
    browser,
    os,
    device,
    isMobile,
    isBot
  };
};

// Get IP-based location (this would typically use a service like ipapi.co or ipinfo.io)
export const getLocationFromIP = async (ip: string) => {
  try {
    // In production, you'd use a real IP geolocation service
    // For now, return mock data
    const mockLocations = [
      { country: 'United States', region: 'California', city: 'San Francisco', lat: 37.7749, lng: -122.4194 },
      { country: 'United Kingdom', region: 'England', city: 'London', lat: 51.5074, lng: -0.1278 },
      { country: 'Germany', region: 'Berlin', city: 'Berlin', lat: 52.5200, lng: 13.4050 },
      { country: 'Japan', region: 'Tokyo', city: 'Tokyo', lat: 35.6762, lng: 139.6503 },
      { country: 'Australia', region: 'New South Wales', city: 'Sydney', lat: -33.8688, lng: 151.2093 }
    ];
    
    const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    
    return {
      country: randomLocation.country,
      region: randomLocation.region,
      city: randomLocation.city,
      latitude: randomLocation.lat,
      longitude: randomLocation.lng,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return {
      country: 'Unknown',
      region: 'Unknown',
      city: 'Unknown',
      latitude: null,
      longitude: null,
      timezone: null
    };
  }
};

// Get client IP (this would be handled server-side in production)
export const getClientIP = (): string => {
  // In a real application, this would be handled on the server
  // For demo purposes, return a mock IP
  return '192.168.1.' + Math.floor(Math.random() * 255);
};

// Generate session ID
export const generateSessionId = (): string => {
  return 'session_' + Math.random().toString(36).substring(2, 15);
};

// Track click with full analytics
export const trackLinkClick = async (shortCode: string) => {
  const userAgent = navigator.userAgent;
  const deviceInfo = getDeviceInfo(userAgent);
  const ip = getClientIP();
  const location = await getLocationFromIP(ip);
  const sessionId = generateSessionId();
  
  const clickData = {
    ipAddress: ip,
    userAgent,
    referer: document.referrer,
    ...location,
    ...deviceInfo,
    sessionId
  };
  
  // In production, this would be an API call to your backend
  console.log('Tracking click:', { shortCode, clickData });
  
  return clickData;
};
