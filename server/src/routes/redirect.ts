import { Router, Request, Response } from 'express';
import { linkService } from '../services/linkService';
import { trackingService } from '../services/trackingService';

const router = Router();

// Handle short link redirects
router.get('/:shortCode', async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;
    console.log(`Redirect request for short code: ${shortCode}`);

    // Get the link
    const link = await linkService.getLinkByShortCode(shortCode);
    console.log(`Found link:`, link);
    
    if (!link) {
      // Return 404 page or redirect to main site
      return res.status(404).json({ 
        success: false, 
        error: 'Link not found or has expired' 
      });
    }

    // Check if link has expired
    if (link.expiresAt && new Date() > link.expiresAt) {
      return res.status(410).json({ 
        success: false, 
        error: 'Link has expired' 
      });
    }

    // Get client information for tracking
    const ip = req.ip || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress || 
               (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
               '127.0.0.1';
    
    const userAgent = req.headers['user-agent'] || '';
    const referer = req.headers.referer;
    const sessionId = req.headers['x-session-id'] as string;

    // Track the click asynchronously (don't wait for it)
    trackingService.trackClick(link.id, ip, userAgent, referer, sessionId)
      .catch(error => console.error('Error tracking click:', error));

    // Return link data for client-side redirect (to ensure tracking completes)
    res.json({
      success: true,
      link: {
        id: link.id,
        originalUrl: link.originalUrl,
        title: link.title,
        shortCode: link.shortCode,
        emailCollectionEnabled: link.emailCollectionEnabled,
        userId: link.userId,
        isActive: link.isActive,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt,
        totalClicks: link.totalClicks,
        uniqueClicks: link.uniqueClicks,
        emailCaptures: link.emailCaptures
      }
    });

  } catch (error) {
    console.error('Error handling redirect:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Direct redirect endpoint (for immediate redirects)
router.get('/:shortCode/direct', async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;
    
    // Get the link
    const link = await linkService.getLinkByShortCode(shortCode);
    
    if (!link) {
      return res.redirect('https://trackerr.pro?error=not-found');
    }

    // Check if link has expired
    if (link.expiresAt && new Date() > link.expiresAt) {
      return res.redirect('https://trackerr.pro?error=expired');
    }

    // Get client information for tracking
    const ip = req.ip || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress || 
               (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
               '127.0.0.1';
    
    const userAgent = req.headers['user-agent'] || '';
    const referer = req.headers.referer;

    // Track the click asynchronously
    trackingService.trackClick(link.id, ip, userAgent, referer)
      .catch(error => console.error('Error tracking click:', error));

    // Immediate redirect
    res.redirect(link.originalUrl);

  } catch (error) {
    console.error('Error handling direct redirect:', error);
    res.redirect('https://trackerr.pro?error=server-error');
  }
});

export default router;
