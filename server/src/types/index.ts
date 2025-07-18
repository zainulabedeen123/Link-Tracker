export interface Link {
  id: string;
  userId: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  title?: string;
  description?: string;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  totalClicks: number;
  uniqueClicks: number;
  emailCaptures: number;
}

export interface Click {
  id: string;
  linkId: string;
  ipAddress: string;
  userAgent: string;
  referer?: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  device: string;
  browser: string;
  os: string;
  isMobile: boolean;
  isBot: boolean;
  sessionId?: string;
  timestamp: Date;
}

export interface CreateLinkRequest {
  originalUrl: string;
  customAlias?: string;
  title?: string;
  description?: string;
  expiresAt?: Date;
}

export interface CreateLinkResponse {
  success: boolean;
  link?: Link;
  shortUrl?: string;
  error?: string;
}

export interface LinkAnalytics {
  linkId: string;
  totalClicks: number;
  uniqueClicks: number;
  clicksByCountry: Record<string, number>;
  clicksByDevice: Record<string, number>;
  clicksByBrowser: Record<string, number>;
  clicksByOS: Record<string, number>;
  clicksByDate: Record<string, number>;
  topReferrers: Array<{ domain: string; clicks: number }>;
  recentClicks: Click[];
}

export interface LocationData {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export interface DeviceInfo {
  device: string;
  browser: string;
  os: string;
  isMobile: boolean;
  isBot: boolean;
}
