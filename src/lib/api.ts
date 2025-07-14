import { CreateLinkRequest, CreateLinkResponse, Link, Click } from '../types/database';

// Mock database - In production, this would be a real database
let mockLinks: Link[] = [];
let mockClicks: Click[] = [];

// Utility functions
const generateShortCode = (): string => {
  return Math.random().toString(36).substring(2, 8);
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// API Functions
export const createLink = async (request: CreateLinkRequest, userId: string): Promise<CreateLinkResponse> => {
  try {
    // Validate URL
    if (!isValidUrl(request.originalUrl)) {
      return { success: false, error: 'Invalid URL provided' };
    }

    // Check if custom alias already exists
    if (request.customAlias) {
      const existingLink = mockLinks.find(link => link.shortCode === request.customAlias);
      if (existingLink) {
        return { success: false, error: 'Custom alias already exists' };
      }
    }

    // Create new link
    const shortCode = request.customAlias || generateShortCode();
    const newLink: Link = {
      id: Date.now().toString(),
      userId,
      originalUrl: request.originalUrl,
      shortCode,
      customAlias: request.customAlias,
      title: request.title,
      description: request.description,
      isActive: true,
      expiresAt: request.expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalClicks: 0,
      uniqueClicks: 0
    };

    mockLinks.push(newLink);

    return {
      success: true,
      link: newLink,
      shortUrl: `https://trackerr.pro/${shortCode}`
    };
  } catch (error) {
    return { success: false, error: 'Failed to create link' };
  }
};

export const getLinkByShortCode = async (shortCode: string): Promise<Link | null> => {
  return mockLinks.find(link => link.shortCode === shortCode && link.isActive) || null;
};

export const getUserLinks = async (userId: string): Promise<Link[]> => {
  return mockLinks.filter(link => link.userId === userId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const trackClick = async (linkId: string, clickData: Partial<Click>): Promise<void> => {
  const link = mockLinks.find(l => l.id === linkId);
  if (!link) return;

  const click: Click = {
    id: Date.now().toString(),
    linkId,
    ipAddress: clickData.ipAddress || '',
    userAgent: clickData.userAgent || '',
    referer: clickData.referer,
    country: clickData.country,
    region: clickData.region,
    city: clickData.city,
    latitude: clickData.latitude,
    longitude: clickData.longitude,
    timezone: clickData.timezone,
    device: clickData.device || 'Unknown',
    browser: clickData.browser || 'Unknown',
    os: clickData.os || 'Unknown',
    isMobile: clickData.isMobile || false,
    isBot: clickData.isBot || false,
    timestamp: new Date(),
    sessionId: clickData.sessionId
  };

  mockClicks.push(click);

  // Update link statistics
  link.totalClicks += 1;
  
  // Check if it's a unique click (simplified - in production, use more sophisticated logic)
  const existingClicks = mockClicks.filter(c => 
    c.linkId === linkId && 
    c.ipAddress === click.ipAddress &&
    new Date(c.timestamp).toDateString() === new Date().toDateString()
  );
  
  if (existingClicks.length === 1) { // First click from this IP today
    link.uniqueClicks += 1;
  }

  link.updatedAt = new Date();
};

export const getLinkAnalytics = async (linkId: string) => {
  const clicks = mockClicks.filter(c => c.linkId === linkId);
  
  return {
    totalClicks: clicks.length,
    uniqueClicks: new Set(clicks.map(c => c.ipAddress)).size,
    clicksByCountry: clicks.reduce((acc, click) => {
      const country = click.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    clicksByDevice: clicks.reduce((acc, click) => {
      acc[click.device] = (acc[click.device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    recentClicks: clicks.slice(-10).reverse()
  };
};
