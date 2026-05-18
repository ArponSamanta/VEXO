import { Router } from 'express';
import { getCoupons, createCoupon, deleteCoupon, validateCoupon } from '../controllers/couponController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Customer validate coupon
router.get('/validate/:code', protect, validateCoupon);

// Admin Coupon Management
router.get('/', protect, authorize('admin', 'superadmin'), getCoupons);
router.post('/', protect, authorize('admin', 'superadmin'), createCoupon);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteCoupon);

export default router;
