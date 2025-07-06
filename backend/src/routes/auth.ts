import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import database from '../database/database';
import { authenticateToken } from '../middleware/auth';
import { userRegistrationSchema, userLoginSchema, updateUserSchema } from '../utils/validation';
import { User, AuthRequest, ApiResponse } from '../types';

const router = Router();

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

// Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const validatedData = userRegistrationSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await database.get(
      'SELECT id FROM users WHERE email = ?',
      [validatedData.email]
    );

    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'Email already registered'
      } as ApiResponse);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const userId = uuidv4();
    await database.run(
      'INSERT INTO users (id, name, email, phone, password, isVerified) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, validatedData.name, validatedData.email, validatedData.phone, hashedPassword, 0]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, email: validatedData.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    const user: User = {
      id: userId,
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      isVerified: false
    };

    res.status(201).json({
      success: true,
      data: { user, token },
      message: 'User registered successfully'
    } as ApiResponse<{ user: User; token: string }>);
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        data: error.errors
      } as ApiResponse);
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Registration failed'
    } as ApiResponse);
    return;
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const validatedData = userLoginSchema.parse(req.body);
    
    // Find user
    const user = await database.get(
      'SELECT * FROM users WHERE email = ?',
      [validatedData.email]
    );

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse);
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
    
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse);
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    const userResponse: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isVerified: !!user.isVerified
    };

    res.json({
      success: true,
      data: { user: userResponse, token },
      message: 'Login successful'
    } as ApiResponse<{ user: User; token: string }>);
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        data: error.errors
      } as ApiResponse);
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Login failed'
    } as ApiResponse);
    return;
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await database.get(
      'SELECT id, name, email, phone, isVerified, createdAt FROM users WHERE id = ?',
      [req.user?.id]
    );

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse);
      return;
    }

    const userResponse: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isVerified: !!user.isVerified,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      data: userResponse
    } as ApiResponse<User>);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    } as ApiResponse);
    return;
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = updateUserSchema.parse(req.body);
    
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (validatedData.name) {
      updateFields.push('name = ?');
      updateValues.push(validatedData.name);
    }

    if (validatedData.phone) {
      updateFields.push('phone = ?');
      updateValues.push(validatedData.phone);
    }

    if (validatedData.isVerified !== undefined) {
      updateFields.push('isVerified = ?');
      updateValues.push(validatedData.isVerified ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      } as ApiResponse);
    }

    updateFields.push('updatedAt = CURRENT_TIMESTAMP');
    updateValues.push(req.user?.id);

    await database.run(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Fetch updated user
    const updatedUser = await database.get(
      'SELECT id, name, email, phone, isVerified, createdAt, updatedAt FROM users WHERE id = ?',
      [req.user?.id]
    );

    const userResponse: User = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isVerified: !!updatedUser.isVerified,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    res.json({
      success: true,
      data: userResponse,
      message: 'Profile updated successfully'
    } as ApiResponse<User>);
  } catch (error: any) {
    console.error('Profile update error:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        data: error.errors
      } as ApiResponse);
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    } as ApiResponse);
  }
});

// Get user's properties
router.get('/my-properties', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const properties = await database.all(
      'SELECT * FROM properties WHERE userId = ? ORDER BY createdAt DESC',
      [req.user?.id]
    );

    // Parse JSON fields
    const processedProperties = properties.map((property: any) => ({
      ...property,
      images: property.images ? JSON.parse(property.images) : [],
      amenities: property.amenities ? JSON.parse(property.amenities) : [],
      isLiked: false
    }));

    res.json({
      success: true,
      data: processedProperties
    } as ApiResponse<any[]>);
  } catch (error) {
    console.error('My properties fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch properties'
    } as ApiResponse);
  }
});

// Verify user (admin or email verification)
router.post('/verify/:userId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    
    // For now, any authenticated user can verify themselves
    // In production, this would be restricted to admins or use email verification
    if (userId !== req.user?.id) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized to verify this user'
      } as ApiResponse);
    }

    await database.run(
      'UPDATE users SET isVerified = 1, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'User verified successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('User verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify user'
    } as ApiResponse);
  }
});

export default router;