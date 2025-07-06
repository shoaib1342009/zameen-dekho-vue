import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import database from '../database/database';
import { authenticateToken } from '../middleware/auth';
import { ApiResponse } from '../types';

const router = Router();

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

// Get user's wishlist
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const wishlistProperties = await database.all(`
      SELECT p.*, w.createdAt as addedToWishlistAt
      FROM properties p
      JOIN wishlists w ON p.id = w.propertyId
      WHERE w.userId = ?
      ORDER BY w.createdAt DESC
    `, [req.user?.id]);

    // Parse JSON fields
    const processedProperties = wishlistProperties.map((property: any) => ({
      ...property,
      images: property.images ? JSON.parse(property.images) : [],
      amenities: property.amenities ? JSON.parse(property.amenities) : [],
      isLiked: true, // All properties in wishlist are liked
      addedToWishlistAt: property.addedToWishlistAt
    }));

    res.json({
      success: true,
      data: processedProperties
    } as ApiResponse<any[]>);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch wishlist'
    } as ApiResponse);
  }
});

// Add property to wishlist
router.post('/add/:propertyId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const propertyId = parseInt(req.params.propertyId);
    
    if (isNaN(propertyId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid property ID'
      } as ApiResponse);
    }

    // Check if property exists
    const property = await database.get('SELECT id FROM properties WHERE id = ?', [propertyId]);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      } as ApiResponse);
    }

    // Check if already in wishlist
    const existingWishlistItem = await database.get(
      'SELECT id FROM wishlists WHERE userId = ? AND propertyId = ?',
      [req.user?.id, propertyId]
    );

    if (existingWishlistItem) {
      return res.status(400).json({
        success: false,
        error: 'Property already in wishlist'
      } as ApiResponse);
    }

    // Add to wishlist
    const wishlistId = uuidv4();
    await database.run(
      'INSERT INTO wishlists (id, userId, propertyId) VALUES (?, ?, ?)',
      [wishlistId, req.user?.id, propertyId]
    );

    res.status(201).json({
      success: true,
      message: 'Property added to wishlist'
    } as ApiResponse);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add property to wishlist'
    } as ApiResponse);
  }
});

// Remove property from wishlist
router.delete('/remove/:propertyId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const propertyId = parseInt(req.params.propertyId);
    
    if (isNaN(propertyId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid property ID'
      } as ApiResponse);
    }

    // Check if in wishlist
    const wishlistItem = await database.get(
      'SELECT id FROM wishlists WHERE userId = ? AND propertyId = ?',
      [req.user?.id, propertyId]
    );

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        error: 'Property not in wishlist'
      } as ApiResponse);
    }

    // Remove from wishlist
    await database.run(
      'DELETE FROM wishlists WHERE userId = ? AND propertyId = ?',
      [req.user?.id, propertyId]
    );

    res.json({
      success: true,
      message: 'Property removed from wishlist'
    } as ApiResponse);
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove property from wishlist'
    } as ApiResponse);
  }
});

// Toggle wishlist status
router.post('/toggle/:propertyId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const propertyId = parseInt(req.params.propertyId);
    
    if (isNaN(propertyId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid property ID'
      } as ApiResponse);
    }

    // Check if property exists
    const property = await database.get('SELECT id FROM properties WHERE id = ?', [propertyId]);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      } as ApiResponse);
    }

    // Check if already in wishlist
    const existingWishlistItem = await database.get(
      'SELECT id FROM wishlists WHERE userId = ? AND propertyId = ?',
      [req.user?.id, propertyId]
    );

    let isLiked = false;
    let message = '';

    if (existingWishlistItem) {
      // Remove from wishlist
      await database.run(
        'DELETE FROM wishlists WHERE userId = ? AND propertyId = ?',
        [req.user?.id, propertyId]
      );
      isLiked = false;
      message = 'Property removed from wishlist';
    } else {
      // Add to wishlist
      const wishlistId = uuidv4();
      await database.run(
        'INSERT INTO wishlists (id, userId, propertyId) VALUES (?, ?, ?)',
        [wishlistId, req.user?.id, propertyId]
      );
      isLiked = true;
      message = 'Property added to wishlist';
    }

    res.json({
      success: true,
      data: { isLiked, propertyId },
      message
    } as ApiResponse<{ isLiked: boolean; propertyId: number }>);
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle wishlist status'
    } as ApiResponse);
  }
});

// Check if property is in user's wishlist
router.get('/check/:propertyId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const propertyId = parseInt(req.params.propertyId);
    
    if (isNaN(propertyId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid property ID'
      } as ApiResponse);
    }

    const wishlistItem = await database.get(
      'SELECT id FROM wishlists WHERE userId = ? AND propertyId = ?',
      [req.user?.id, propertyId]
    );

    res.json({
      success: true,
      data: { isLiked: !!wishlistItem, propertyId }
    } as ApiResponse<{ isLiked: boolean; propertyId: number }>);
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check wishlist status'
    } as ApiResponse);
  }
});

// Get wishlist count
router.get('/count', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await database.get(
      'SELECT COUNT(*) as count FROM wishlists WHERE userId = ?',
      [req.user?.id]
    );

    res.json({
      success: true,
      data: { count: result.count }
    } as ApiResponse<{ count: number }>);
  } catch (error) {
    console.error('Error getting wishlist count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get wishlist count'
    } as ApiResponse);
  }
});

export default router;