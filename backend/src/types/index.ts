export interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  type: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  images?: string[];
  label: string;
  tag: string;
  address: string;
  builder: string;
  description: string;
  amenities?: string[];
  videoUrl?: string;
  isLiked: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  latitude?: number;
  longitude?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePropertyRequest {
  title: string;
  price: string;
  location: string;
  type: string;
  beds: number;
  baths: number;
  sqft: number;
  label: string;
  tag: string;
  address: string;
  builder: string;
  description: string;
  amenities?: string[];
  videoUrl?: string;
  latitude?: number;
  longitude?: number;
}

export interface PropertyFilter {
  location?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  minSqft?: number;
  maxSqft?: number;
  label?: string;
  tag?: string;
  builder?: string;
  amenities?: string[];
  search?: string;
  page?: number;
  limit?: number;
}

export interface Wishlist {
  id: string;
  userId: string;
  propertyId: number;
  createdAt: string;
}

export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}