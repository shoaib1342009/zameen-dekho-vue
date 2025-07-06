import { z } from 'zod';

export const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters')
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  price: z.string().min(1, 'Price is required'),
  location: z.string().min(2, 'Location is required'),
  type: z.string().min(1, 'Property type is required'),
  beds: z.number().min(0, 'Beds must be 0 or more'),
  baths: z.number().min(0, 'Baths must be 0 or more'),
  sqft: z.number().min(1, 'Square feet must be greater than 0'),
  label: z.string().min(1, 'Label is required'),
  tag: z.string().min(1, 'Tag is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  builder: z.string().min(2, 'Builder name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  amenities: z.array(z.string()).optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

export const propertyFilterSchema = z.object({
  location: z.string().optional(),
  type: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  beds: z.number().optional(),
  baths: z.number().optional(),
  minSqft: z.number().optional(),
  maxSqft: z.number().optional(),
  label: z.string().optional(),
  tag: z.string().optional(),
  builder: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  search: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional()
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 characters').optional(),
  isVerified: z.boolean().optional()
});