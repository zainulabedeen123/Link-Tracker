import { Router, Request, Response } from 'express';
import { linkService } from '../services/linkService';
import { trackingService } from '../services/trackingService';

const router = Router();

// Create a new link
router.post('/', async (req: Request, res: Response) => {
  try {
    const { originalUrl, customAlias, title, description, expiresAt } = req.body;
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'User ID required' });
    }

    if (!originalUrl) {
      return res.status(400).json({ success: false, error: 'Original URL is required' });
    }

    const result = await linkService.createLink({
      originalUrl,
      customAlias,
      title,
      description,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined
    }, userId);

    res.json(result);
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get user's links
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'User ID required' });
    }

    const links = await linkService.getUserLinks(userId);
    res.json({ success: true, links });
  } catch (error) {
    console.error('Error getting user links:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get link by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string;

    const link = await linkService.getLinkById(id);
    
    if (!link) {
      return res.status(404).json({ success: false, error: 'Link not found' });
    }

    // Check if user owns the link
    if (link.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    res.json({ success: true, link });
  } catch (error) {
    console.error('Error getting link:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get link analytics
router.get('/:id/analytics', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string;

    const link = await linkService.getLinkById(id);
    
    if (!link) {
      return res.status(404).json({ success: false, error: 'Link not found' });
    }

    // Check if user owns the link
    if (link.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const analytics = await trackingService.getLinkAnalytics(id);
    res.json({ success: true, analytics });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get link by short code (for email collection page)
router.get('/by-code/:shortCode', async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;

    const link = await linkService.getLinkByShortCode(shortCode);

    if (!link) {
      return res.status(404).json({
        success: false,
        error: 'Link not found'
      });
    }

    // Check if link has expired
    if (link.expiresAt && new Date() > link.expiresAt) {
      return res.status(410).json({
        success: false,
        error: 'Link has expired'
      });
    }

    res.json({
      success: true,
      link: {
        id: link.id,
        originalUrl: link.originalUrl,
        title: link.title,
        shortCode: link.shortCode
      }
    });
  } catch (error) {
    console.error('Error getting link by short code:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
