import { Request, Response } from 'express';
import Product from '../models/Product';
import { asyncHandler, ApiError } from '../middleware/error';
import { productFiltersSchema, createProductSchema } from '@vexo/validators';

// @route   GET /api/products
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const filters = productFiltersSchema.parse(req.query);
  const { search, category, brand, minPrice, maxPrice, rating, sort, page, limit } = filters;

  const query: any = { isActive: true };

  if (search) {
    query.$text = { $search: search };
  }
  if (category) {
    query.category = { $regex: new RegExp(category, 'i') };
  }
  if (brand) {
    query.brand = { $regex: new RegExp(brand, 'i') };
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }
  if (rating !== undefined) {
    query.rating = { $gte: rating };
  }

  // Sort
  let sortQuery: any = { createdAt: -1 };
  switch (sort) {
    case 'price_asc':
      sortQuery = { price: 1 };
      break;
    case 'price_desc':
      sortQuery = { price: -1 };
      break;
    case 'newest':
      sortQuery = { createdAt: -1 };
      break;
    case 'rating':
      sortQuery = { rating: -1 };
      break;
    case 'popular':
      sortQuery = { numReviews: -1 };
      break;
  }

  const skip = (page - 1) * limit;
  const total = await Product.countDocuments(query);
  const products = await Product.find(query).sort(sortQuery).skip(skip).limit(limit);

  res.json({
    success: true,
    data: {
      data: products,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// @route   GET /api/products/featured
export const getFeaturedProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await Product.find({ featured: true, isActive: true }).limit(8);
  res.json({ success: true, data: products });
});

// @route   GET /api/products/categories
export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await Product.distinct('category', { isActive: true });
  res.json({ success: true, data: categories });
});

// @route   GET /api/products/brands
export const getBrands = asyncHandler(async (_req: Request, res: Response) => {
  const brands = await Product.distinct('brand', { isActive: true });
  res.json({ success: true, data: brands });
});

// @route   GET /api/products/:id
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product || !product.isActive) {
    throw new ApiError(404, 'Product not found');
  }
  res.json({ success: true, data: product });
});

// @route   GET /api/products/slug/:slug
export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true });
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  res.json({ success: true, data: product });
});

// ==================== ADMIN ROUTES ====================

// @route   POST /api/products (Admin)
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const data = createProductSchema.parse(req.body);
  const product = await Product.create(data);
  res.status(201).json({ success: true, data: product });
});

// @route   PUT /api/products/:id (Admin)
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, data: product });
});

// @route   DELETE /api/products/:id (Admin)
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, message: 'Product deactivated' });
});

// @route   GET /api/products/admin/all (Admin - includes inactive)
export const getAllProductsAdmin = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const total = await Product.countDocuments();
  const products = await Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

  res.json({
    success: true,
    data: { data: products, page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});
