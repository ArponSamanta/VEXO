import { Router } from 'express';
import { getProducts, getFeaturedProducts, getCategories, getBrands, getProduct, getProductBySlug, createProduct, updateProduct, deleteProduct, getAllProductsAdmin } from '../controllers/productController';
import { getProductReviews, createReview } from '../controllers/reviewController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Public
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProduct);
router.get('/:productId/reviews', getProductReviews);

// Customer
router.post('/:productId/reviews', protect, createReview);

// Admin
router.post('/', protect, authorize('admin', 'superadmin'), createProduct);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateProduct);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteProduct);
router.get('/admin/all', protect, authorize('admin', 'superadmin'), getAllProductsAdmin);

export default router;
