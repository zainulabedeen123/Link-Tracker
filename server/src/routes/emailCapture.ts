import { Router, Request, Response } from 'express';
import { db } from '../database/connection';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

interface EmailCaptureRequest {
  linkId?: string;
  shortCode: string;
  email: string;
  name: string;
  userAgent?: string;
  referrer?: string;
  timestamp?: string;
}

// POST /api/email-capture - Capture email and name from link click
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      linkId,
      shortCode,
      email,
      name,
      userAgent,
      referrer,
      timestamp
    }: EmailCaptureRequest = req.body;

    // Validate required fields
    if (!shortCode || !email || !name) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: shortCode, email, and name are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Validate name length
    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Name must be at least 2 characters long'
      });
    }

    // Get link ID from short code if not provided
    let actualLinkId = linkId;
    if (!actualLinkId) {
      const linkQuery = 'SELECT id FROM links WHERE short_code = $1';
      const linkResult = await db.get(linkQuery, [shortCode]);

      if (!linkResult) {
        return res.status(404).json({
          success: false,
          error: 'Link not found'
        });
      }

      actualLinkId = linkResult.id;
    }

    // Check if email already exists for this link (prevent duplicates)
    const existingQuery = `
      SELECT id FROM email_captures
      WHERE link_id = $1 AND email = $2
    `;
    const existingResult = await db.get(existingQuery, [actualLinkId, email.toLowerCase()]);

    if (existingResult) {
      // Email already captured for this link, but still return success
      return res.json({
        success: true,
        message: 'Email already captured for this link',
        duplicate: true
      });
    }

    // Insert email capture record
    const capturedAt = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();

    const insertQuery = `
      INSERT INTO email_captures (
        link_id,
        email,
        name,
        user_agent,
        referrer,
        captured_at,
        ip_address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    const values = [
      actualLinkId,
      email.toLowerCase().trim(),
      name.trim(),
      userAgent || null,
      referrer || null,
      capturedAt,
      req.ip || (req as any).connection?.remoteAddress || null
    ];

    const insertResult = await db.query(insertQuery, values);
    const captureId = insertResult.rows[0].id;

    // Update link statistics (increment email captures count)
    const updateStatsQuery = `
      UPDATE links
      SET email_captures = COALESCE(email_captures, 0) + 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await db.run(updateStatsQuery, [actualLinkId]);

    res.json({
      success: true,
      message: 'Email captured successfully',
      data: {
        id: captureId,
        capturedAt: capturedAt
      }
    });

  } catch (error) {
    console.error('Email capture error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/email-capture/:linkId - Get email captures for a specific link
router.get('/:linkId', async (req: Request, res: Response) => {
  try {
    const { linkId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const query = `
      SELECT
        id,
        email,
        name,
        user_agent,
        referrer,
        captured_at,
        ip_address
      FROM email_captures
      WHERE link_id = $1
      ORDER BY captured_at DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM email_captures
      WHERE link_id = $1
    `;

    const [dataResult, countResult] = await Promise.all([
      db.all(query, [linkId, Number(limit), offset]),
      db.get(countQuery, [linkId])
    ]);

    const total = parseInt(countResult.total);
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      data: {
        captures: dataResult,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get email captures error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/email-capture/user/:userId - Get all email captures for a user's links
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 100 } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const query = `
      SELECT
        ec.id,
        ec.email,
        ec.name,
        ec.user_agent,
        ec.referrer,
        ec.captured_at,
        ec.ip_address,
        l.title as link_title,
        l.short_code,
        l.original_url
      FROM email_captures ec
      JOIN links l ON ec.link_id = l.id
      WHERE l.user_id = $1
      ORDER BY ec.captured_at DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM email_captures ec
      JOIN links l ON ec.link_id = l.id
      WHERE l.user_id = $1
    `;

    const [dataResult, countResult] = await Promise.all([
      db.all(query, [userId, Number(limit), offset]),
      db.get(countQuery, [userId])
    ]);

    const total = parseInt(countResult.total);
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      data: {
        captures: dataResult,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get user email captures error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
