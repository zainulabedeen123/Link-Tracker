import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { db } from '../database/connection';
import { Click, DeviceInfo, LocationData } from '../types';
import { linkService } from './linkService';

export class TrackingService {
  // Parse user agent to extract device info
  parseUserAgent(userAgent: string): DeviceInfo {
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
    
    return { browser, os, device, isMobile, isBot };
  }

  // Get location data from IP address
  async getLocationFromIP(ip: string): Promise<LocationData> {
    try {
      // Skip localhost and private IPs
      if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        return {
          country: 'Local',
          region: 'Local',
          city: 'Local'
        };
      }

      // Use ipapi.co for geolocation (free tier: 1000 requests/day)
      const response = await axios.get(`https://ipapi.co/${ip}/json/`, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Trackerr.pro/1.0'
        }
      });

      const data = response.data;
      
      return {
        country: data.country_name || 'Unknown',
        region: data.region || 'Unknown',
        city: data.city || 'Unknown',
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        timezone: data.timezone || null
      };
    } catch (error) {
      console.error('Error getting location from IP:', error);
      return {
        country: 'Unknown',
        region: 'Unknown',
        city: 'Unknown'
      };
    }
  }

  // Extract domain from referrer URL
  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return 'Direct';
    }
  }

  // Check if click is unique (simplified logic)
  private async isUniqueClick(linkId: string, ip: string, sessionId?: string): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const existing = await db.get(`
        SELECT id FROM clicks 
        WHERE link_id = ? AND ip_address = ? AND DATE(timestamp) = ?
        LIMIT 1
      `, [linkId, ip, today]);
      
      return !existing;
    } catch (error) {
      console.error('Error checking unique click:', error);
      return false;
    }
  }

  // Track a click
  async trackClick(
    linkId: string,
    ip: string,
    userAgent: string,
    referer?: string,
    sessionId?: string
  ): Promise<void> {
    try {
      // Parse device info
      const deviceInfo = this.parseUserAgent(userAgent);
      
      // Get location data
      const locationData = await this.getLocationFromIP(ip);
      
      // Check if unique
      const isUnique = await this.isUniqueClick(linkId, ip, sessionId);
      
      // Create click record
      const clickId = uuidv4();
      const timestamp = new Date().toISOString();
      
      await db.run(`
        INSERT INTO clicks (
          id, link_id, ip_address, user_agent, referer,
          country, region, city, latitude, longitude, timezone,
          device, browser, os, is_mobile, is_bot, session_id, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        clickId, linkId, ip, userAgent, referer,
        locationData.country, locationData.region, locationData.city,
        locationData.latitude, locationData.longitude, locationData.timezone,
        deviceInfo.device, deviceInfo.browser, deviceInfo.os,
        deviceInfo.isMobile ? 1 : 0, deviceInfo.isBot ? 1 : 0,
        sessionId, timestamp
      ]);

      // Update link click counts
      await linkService.updateClickCounts(linkId, isUnique);
      
      console.log(`Tracked click for link ${linkId} from ${ip} (${locationData.country})`);
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }

  // Get analytics for a link
  async getLinkAnalytics(linkId: string) {
    try {
      const clicks = await db.all('SELECT * FROM clicks WHERE link_id = ?', [linkId]);
      
      // Group by country
      const clicksByCountry: Record<string, number> = {};
      const clicksByDevice: Record<string, number> = {};
      const clicksByBrowser: Record<string, number> = {};
      const clicksByOS: Record<string, number> = {};
      const clicksByDate: Record<string, number> = {};
      const referrerCounts: Record<string, number> = {};

      clicks.forEach(click => {
        // Country stats
        const country = click.country || 'Unknown';
        clicksByCountry[country] = (clicksByCountry[country] || 0) + 1;

        // Device stats
        clicksByDevice[click.device] = (clicksByDevice[click.device] || 0) + 1;

        // Browser stats
        clicksByBrowser[click.browser] = (clicksByBrowser[click.browser] || 0) + 1;

        // OS stats
        clicksByOS[click.os] = (clicksByOS[click.os] || 0) + 1;

        // Date stats
        const date = new Date(click.timestamp).toISOString().split('T')[0];
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;

        // Referrer stats
        const domain = click.referer ? this.extractDomain(click.referer) : 'Direct';
        referrerCounts[domain] = (referrerCounts[domain] || 0) + 1;
      });

      // Top referrers
      const topReferrers = Object.entries(referrerCounts)
        .map(([domain, clicks]) => ({ domain, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      // Recent clicks (last 10)
      const recentClicks = clicks
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10)
        .map(click => ({
          ...click,
          timestamp: new Date(click.timestamp)
        }));

      return {
        linkId,
        totalClicks: clicks.length,
        uniqueClicks: new Set(clicks.map(c => c.ip_address)).size,
        clicksByCountry,
        clicksByDevice,
        clicksByBrowser,
        clicksByOS,
        clicksByDate,
        topReferrers,
        recentClicks
      };
    } catch (error) {
      console.error('Error getting link analytics:', error);
      return null;
    }
  }
}

export const trackingService = new TrackingService();
