import { CreateLinkRequest, CreateLinkResponse, Link, Click } from '../types/database';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'
);

// Get user ID from Clerk (you'll need to pass this from components)
let currentUserId: string | null = null;

export const setCurrentUserId = (userId: string) => {
  currentUserId = userId;
};

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log('API Request:', { url, method: options.method || 'GET', currentUserId });

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(currentUserId && { 'x-user-id': currentUserId })
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: `HTTP ${response.status}: ${errorText}` };
      }

      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// API Functions
export const createLink = async (request: CreateLinkRequest, userId: string): Promise<CreateLinkResponse> => {
  try {
    setCurrentUserId(userId);
    const response = await apiRequest('/links', {
      method: 'POST',
      body: JSON.stringify(request)
    });

    // Convert date strings to Date objects if link is returned
    if (response.success && response.link) {
      response.link = {
        ...response.link,
        createdAt: new Date(response.link.createdAt),
        updatedAt: new Date(response.link.updatedAt),
        expiresAt: response.link.expiresAt ? new Date(response.link.expiresAt) : undefined
      };
    }

    return response;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create link'
    };
  }
};

export const getLinkByShortCode = async (shortCode: string): Promise<Link | null> => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/r/${shortCode}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data : null;
  } catch (error) {
    return null;
  }
};

export const getUserLinks = async (userId: string): Promise<Link[]> => {
  try {
    setCurrentUserId(userId);
    const response = await apiRequest('/links');

    // Convert date strings to Date objects
    const links = (response.links || []).map((link: any) => ({
      ...link,
      createdAt: new Date(link.createdAt),
      updatedAt: new Date(link.updatedAt),
      expiresAt: link.expiresAt ? new Date(link.expiresAt) : undefined
    }));

    return links;
  } catch (error) {
    console.error('Error fetching user links:', error);
    return [];
  }
};

export const trackClick = async (linkId: string, clickData: Partial<Click>): Promise<void> => {
  // This is now handled by the backend when redirecting
  // The frontend doesn't need to track clicks directly
  console.log('Click tracking handled by backend');
};

export const getLinkById = async (linkId: string, userId: string): Promise<Link | null> => {
  try {
    setCurrentUserId(userId);
    const response = await apiRequest(`/links/${linkId}`);

    if (response.success && response.link) {
      return {
        ...response.link,
        createdAt: new Date(response.link.createdAt),
        updatedAt: new Date(response.link.updatedAt),
        expiresAt: response.link.expiresAt ? new Date(response.link.expiresAt) : undefined
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching link:', error);
    return null;
  }
};

export const getLinkAnalytics = async (linkId: string, userId: string) => {
  try {
    setCurrentUserId(userId);
    const response = await apiRequest(`/links/${linkId}/analytics`);
    return response.analytics;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
};

// Email Capture Functions
export interface EmailCaptureData {
  linkId?: string;
  shortCode: string;
  email: string;
  name: string;
  userAgent?: string;
  referrer?: string;
  timestamp?: string;
}

export interface EmailCapture {
  id: string;
  email: string;
  name: string;
  userAgent?: string;
  referrer?: string;
  capturedAt: string;
  ipAddress?: string;
}

export const submitEmailCapture = async (data: EmailCaptureData): Promise<{ success: boolean; message?: string; duplicate?: boolean }> => {
  return await apiRequest('/email-capture', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const getEmailCaptures = async (linkId: string, page = 1, limit = 50): Promise<{
  captures: EmailCapture[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}> => {
  const response = await apiRequest(`/email-capture/${linkId}?page=${page}&limit=${limit}`);
  return response.data;
};


