import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import database from '../database/database';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { propertySchema, propertyFilterSchema } from '../utils/validation';
import { Property, CreatePropertyRequest, PropertyFilter, ApiResponse, PaginatedResponse } from '../types';

const router = Router();

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

// Get all properties with filtering and pagination
router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const filters = req.query as any;
    const validatedFilters = propertyFilterSchema.parse({
      ...filters,
      page: filters.page ? parseInt(filters.page) : 1,
      limit: filters.limit ? parseInt(filters.limit) : 12,
      minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
      beds: filters.beds ? parseInt(filters.beds) : undefined,
      baths: filters.baths ? parseInt(filters.baths) : undefined,
      minSqft: filters.minSqft ? parseInt(filters.minSqft) : undefined,
      maxSqft: filters.maxSqft ? parseInt(filters.maxSqft) : undefined,
    });

    let query = 'SELECT * FROM properties WHERE 1=1';
    const params: any[] = [];

    // Apply filters
    if (validatedFilters.location) {
      query += ' AND location LIKE ?';
      params.push(`%${validatedFilters.location}%`);
    }

    if (validatedFilters.type) {
      query += ' AND type = ?';
      params.push(validatedFilters.type);
    }

    if (validatedFilters.minPrice) {
      query += ' AND CAST(price AS INTEGER) >= ?';
      params.push(validatedFilters.minPrice);
    }

    if (validatedFilters.maxPrice) {
      query += ' AND CAST(price AS INTEGER) <= ?';
      params.push(validatedFilters.maxPrice);
    }

    if (validatedFilters.beds) {
      query += ' AND beds = ?';
      params.push(validatedFilters.beds);
    }

    if (validatedFilters.baths) {
      query += ' AND baths = ?';
      params.push(validatedFilters.baths);
    }

    if (validatedFilters.label) {
      query += ' AND label = ?';
      params.push(validatedFilters.label);
    }

    if (validatedFilters.tag) {
      query += ' AND tag = ?';
      params.push(validatedFilters.tag);
    }

    if (validatedFilters.builder) {
      query += ' AND builder LIKE ?';
      params.push(`%${validatedFilters.builder}%`);
    }

    if (validatedFilters.search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR location LIKE ? OR address LIKE ?)';
      const searchTerm = `%${validatedFilters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Count total for pagination
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countResult = await database.get(countQuery, params);
    const total = countResult.total;

    // Add pagination
    const page = validatedFilters.page || 1;
    const limit = validatedFilters.limit || 12;
    const offset = (page - 1) * limit;
    
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const properties = await database.all(query, params);
    
    // Parse JSON fields and check wishlist status
    const processedProperties = properties.map((property: any) => ({
      ...property,
      images: property.images ? JSON.parse(property.images) : [],
      amenities: property.amenities ? JSON.parse(property.amenities) : [],
      isLiked: false // Will be updated based on user's wishlist
    }));

    // If user is authenticated, check wishlist status
    if (req.user) {
      for (const property of processedProperties) {
        const wishlistItem = await database.get(
          'SELECT id FROM wishlists WHERE userId = ? AND propertyId = ?',
          [req.user.id, property.id]
        );
        property.isLiked = !!wishlistItem;
      }
    }

    const response: ApiResponse<PaginatedResponse<Property>> = {
      success: true,
      data: {
        data: processedProperties,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch properties'
    } as ApiResponse);
  }
});

// Get property by ID
router.get('/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const propertyId = parseInt(req.params.id);
    
    if (isNaN(propertyId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid property ID'
      } as ApiResponse);
    }

    const property = await database.get('SELECT * FROM properties WHERE id = ?', [propertyId]);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      } as ApiResponse);
    }

    // Parse JSON fields
    const processedProperty = {
      ...property,
      images: property.images ? JSON.parse(property.images) : [],
      amenities: property.amenities ? JSON.parse(property.amenities) : [],
      isLiked: false
    };

    // Check wishlist status if user is authenticated
    if (req.user) {
      const wishlistItem = await database.get(
        'SELECT id FROM wishlists WHERE userId = ? AND propertyId = ?',
        [req.user.id, propertyId]
      );
      processedProperty.isLiked = !!wishlistItem;
    }

    res.json({
      success: true,
      data: processedProperty
    } as ApiResponse<Property>);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch property'
    } as ApiResponse);
  }
});

// Create new property (authenticated)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = propertySchema.parse(req.body);
    
    const result = await database.run(
      `INSERT INTO properties (
        title, price, location, type, beds, baths, sqft, image, images, 
        label, tag, address, builder, description, amenities, videoUrl, 
        latitude, longitude, userId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        validatedData.title,
        validatedData.price,
        validatedData.location,
        validatedData.type,
        validatedData.beds,
        validatedData.baths,
        validatedData.sqft,
        req.body.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
        JSON.stringify(req.body.images || []),
        validatedData.label,
        validatedData.tag,
        validatedData.address,
        validatedData.builder,
        validatedData.description,
        JSON.stringify(validatedData.amenities || []),
        validatedData.videoUrl || null,
        validatedData.latitude || null,
        validatedData.longitude || null,
        req.user?.id
      ]
    );

    const newProperty = await database.get('SELECT * FROM properties WHERE id = ?', [result.lastID]);
    
    const processedProperty = {
      ...newProperty,
      images: newProperty.images ? JSON.parse(newProperty.images) : [],
      amenities: newProperty.amenities ? JSON.parse(newProperty.amenities) : [],
      isLiked: false
    };

    res.status(201).json({
      success: true,
      data: processedProperty,
      message: 'Property created successfully'
    } as ApiResponse<Property>);
  } catch (error: any) {
    console.error('Error creating property:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        data: error.errors
      } as ApiResponse);
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create property'
    } as ApiResponse);
  }
});

// Update property (authenticated, owner only)
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const propertyId = parseInt(req.params.id);
    
    if (isNaN(propertyId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid property ID'
      } as ApiResponse);
    }

    // Check if property exists and user owns it
    const existingProperty = await database.get(
      'SELECT * FROM properties WHERE id = ? AND userId = ?',
      [propertyId, req.user?.id]
    );

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        error: 'Property not found or unauthorized'
      } as ApiResponse);
    }

    const validatedData = propertySchema.parse(req.body);
    
    await database.run(
      `UPDATE properties SET 
        title = ?, price = ?, location = ?, type = ?, beds = ?, baths = ?, 
        sqft = ?, image = ?, images = ?, label = ?, tag = ?, address = ?, 
        builder = ?, description = ?, amenities = ?, videoUrl = ?, 
        latitude = ?, longitude = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        validatedData.title,
        validatedData.price,
        validatedData.location,
        validatedData.type,
        validatedData.beds,
        validatedData.baths,
        validatedData.sqft,
        req.body.image || existingProperty.image,
        JSON.stringify(req.body.images || []),
        validatedData.label,
        validatedData.tag,
        validatedData.address,
        validatedData.builder,
        validatedData.description,
        JSON.stringify(validatedData.amenities || []),
        validatedData.videoUrl || null,
        validatedData.latitude || null,
        validatedData.longitude || null,
        propertyId
      ]
    );

    const updatedProperty = await database.get('SELECT * FROM properties WHERE id = ?', [propertyId]);
    
    const processedProperty = {
      ...updatedProperty,
      images: updatedProperty.images ? JSON.parse(updatedProperty.images) : [],
      amenities: updatedProperty.amenities ? JSON.parse(updatedProperty.amenities) : [],
      isLiked: false
    };

    res.json({
      success: true,
      data: processedProperty,
      message: 'Property updated successfully'
    } as ApiResponse<Property>);
  } catch (error: any) {
    console.error('Error updating property:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        data: error.errors
      } as ApiResponse);
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update property'
    } as ApiResponse);
  }
});

// Delete property (authenticated, owner only)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const propertyId = parseInt(req.params.id);
    
    if (isNaN(propertyId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid property ID'
      } as ApiResponse);
    }

    // Check if property exists and user owns it
    const existingProperty = await database.get(
      'SELECT id FROM properties WHERE id = ? AND userId = ?',
      [propertyId, req.user?.id]
    );

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        error: 'Property not found or unauthorized'
      } as ApiResponse);
    }

    // Delete from wishlists first (foreign key constraint)
    await database.run('DELETE FROM wishlists WHERE propertyId = ?', [propertyId]);
    
    // Delete the property
    await database.run('DELETE FROM properties WHERE id = ?', [propertyId]);

    res.json({
      success: true,
      message: 'Property deleted successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete property'
    } as ApiResponse);
  }
});

export default router;