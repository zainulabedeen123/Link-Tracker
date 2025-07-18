import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/connection';
import { Link, CreateLinkRequest, CreateLinkResponse } from '../types';

export class LinkService {
  // Generate a random short code
  private generateShortCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Validate URL
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Create a new link
  async createLink(request: CreateLinkRequest, userId: string): Promise<CreateLinkResponse> {
    try {
      // Validate URL
      if (!this.isValidUrl(request.originalUrl)) {
        return { success: false, error: 'Invalid URL provided' };
      }

      // Check if custom alias already exists
      if (request.customAlias) {
        const existing = await this.getLinkByShortCode(request.customAlias);
        if (existing) {
          return { success: false, error: 'Custom alias already exists' };
        }
      }

      // Generate short code or use custom alias
      let shortCode = request.customAlias;
      if (!shortCode) {
        // Generate unique short code
        do {
          shortCode = this.generateShortCode();
        } while (await this.getLinkByShortCode(shortCode));
      }

      // Create link object
      const linkId = uuidv4();
      const now = new Date().toISOString();

      const link: Partial<Link> = {
        id: linkId,
        userId,
        originalUrl: request.originalUrl,
        shortCode,
        customAlias: request.customAlias,
        title: request.title,
        description: request.description,
        isActive: true,
        expiresAt: request.expiresAt,
        createdAt: new Date(now),
        updatedAt: new Date(now),
        totalClicks: 0,
        uniqueClicks: 0
      };

      // Insert into database
      await db.run(`
        INSERT INTO links (
          id, user_id, original_url, short_code, custom_alias, 
          title, description, is_active, expires_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        linkId, userId, request.originalUrl, shortCode, request.customAlias,
        request.title, request.description, 1, 
        request.expiresAt?.toISOString(), now, now
      ]);

      const createdLink = await this.getLinkById(linkId);
      
      return {
        success: true,
        link: createdLink!,
        shortUrl: `https://trackerr.pro/${shortCode}`
      };
    } catch (error) {
      console.error('Error creating link:', error);
      return { success: false, error: 'Failed to create link' };
    }
  }

  // Get link by ID
  async getLinkById(id: string): Promise<Link | null> {
    try {
      const row = await db.get('SELECT * FROM links WHERE id = ?', [id]);
      return row ? this.mapRowToLink(row) : null;
    } catch (error) {
      console.error('Error getting link by ID:', error);
      return null;
    }
  }

  // Get link by short code
  async getLinkByShortCode(shortCode: string): Promise<Link | null> {
    try {
      const row = await db.get('SELECT * FROM links WHERE short_code = ? AND is_active = 1', [shortCode]);
      return row ? this.mapRowToLink(row) : null;
    } catch (error) {
      console.error('Error getting link by short code:', error);
      return null;
    }
  }

  // Get all links for a user
  async getUserLinks(userId: string): Promise<Link[]> {
    try {
      const rows = await db.all(
        'SELECT * FROM links WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      return rows.map(row => this.mapRowToLink(row));
    } catch (error) {
      console.error('Error getting user links:', error);
      return [];
    }
  }

  // Update link click counts
  async updateClickCounts(linkId: string, isUnique: boolean): Promise<void> {
    try {
      if (isUnique) {
        await db.run(
          'UPDATE links SET total_clicks = total_clicks + 1, unique_clicks = unique_clicks + 1 WHERE id = ?',
          [linkId]
        );
      } else {
        await db.run(
          'UPDATE links SET total_clicks = total_clicks + 1 WHERE id = ?',
          [linkId]
        );
      }
    } catch (error) {
      console.error('Error updating click counts:', error);
    }
  }

  // Map database row to Link object
  private mapRowToLink(row: any): Link {
    return {
      id: row.id,
      userId: row.user_id,
      originalUrl: row.original_url,
      shortCode: row.short_code,
      customAlias: row.custom_alias,
      title: row.title,
      description: row.description,
      isActive: Boolean(row.is_active),
      expiresAt: row.expires_at ? new Date(row.expires_at) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      totalClicks: row.total_clicks || 0,
      uniqueClicks: row.unique_clicks || 0,
      emailCaptures: row.email_captures || 0
    };
  }
}

export const linkService = new LinkService();
