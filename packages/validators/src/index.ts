import { z } from 'zod';

// ==================== AUTH ====================
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
});

// ==================== ADDRESS ====================
export const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  isDefault: z.boolean().default(false),
});

// ==================== PRODUCT ====================
export const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  shortDescription: z.string().max(300).optional(),
  price: z.number().positive('Price must be positive'),
  comparePrice: z.number().positive().optional(),
  images: z.array(z.string().url()).min(1, 'At least one image required'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  sku: z.string().optional(),
  tags: z.array(z.string()).default([]),
  specifications: z.record(z.string()).default({}),
  featured: z.boolean().default(false),
});

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'rating', 'popular']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

// ==================== CART ====================
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

// ==================== ORDER ====================
export const createOrderSchema = z.object({
  shippingAddress: addressSchema,
  paymentMethod: z.enum(['razorpay', 'cod']),
  couponCode: z.string().optional(),
});

// ==================== REVIEW ====================
export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(2, 'Headline must be at least 2 characters').max(100),
  comment: z.string().min(3, 'Feedback must be at least 3 characters').max(1000),
});

// ==================== COUPON ====================
export const createCouponSchema = z.object({
  code: z.string().min(3).max(20).transform(v => v.toUpperCase()),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().positive(),
  minPurchase: z.number().min(0).default(0),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().default(100),
  expiresAt: z.string().datetime(),
});

// Export types inferred from schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type ProductFiltersInput = z.infer<typeof productFiltersSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
