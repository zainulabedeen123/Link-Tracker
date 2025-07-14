import { CreateLinkRequest, CreateLinkResponse, Link, Click } from '../types/database';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Get user ID from Clerk (you'll need to pass this from components)
let currentUserId: string | null = null;

export const setCurrentUserId = (userId: string) => {
  currentUserId = userId;
};

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(currentUserId && { 'x-user-id': currentUserId })
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// API Functions
export const createLink = async (request: CreateLinkRequest, userId: string): Promise<CreateLinkResponse> => {
  try {
    setCurrentUserId(userId);
    return await apiRequest('/links', {
      method: 'POST',
      body: JSON.stringify(request)
    });
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
    return response.links || [];
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
