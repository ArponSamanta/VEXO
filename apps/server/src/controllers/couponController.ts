import { Request, Response } from 'express';
import Coupon from '../models/Coupon';
import { asyncHandler, ApiError } from '../middleware/error';
import { createCouponSchema } from '@vexo/validators';

// @route   GET /api/coupons
// @desc    Get all coupons (Admin only)
export const getCoupons = asyncHandler(async (req: Request, res: Response) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, data: coupons });
});

// @route   POST /api/coupons
// @desc    Create a coupon (Admin only)
export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const data = createCouponSchema.parse(req.body);

  const existing = await Coupon.findOne({ code: data.code });
  if (existing) {
    throw new ApiError(400, 'Coupon code already exists');
  }

  const coupon = await Coupon.create(data);
  res.status(201).json({ success: true, data: coupon });
});

// @route   DELETE /api/coupons/:id
// @desc    Delete a coupon (Admin only)
export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    throw new ApiError(404, 'Coupon not found');
  }
  await coupon.deleteOne();
  res.json({ success: true, message: 'Coupon deleted successfully' });
});

// @route   GET /api/coupons/validate/:code
// @desc    Validate a coupon code (Customer)
export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.params;
  const { cartTotal } = req.query;

  const coupon = await Coupon.findOne({
    code: (code as string).toUpperCase(),
    isActive: true,
    expiresAt: { $gt: new Date() }
  });

  if (!coupon) {
    throw new ApiError(404, 'Invalid or expired coupon code');
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError(400, 'Coupon usage limit has been reached');
  }

  const total = Number(cartTotal) || 0;
  if (total < coupon.minPurchase) {
    throw new ApiError(400, `Minimum purchase of ₹${coupon.minPurchase} is required to use this coupon`);
  }

  res.json({
    success: true,
    data: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      maxDiscount: coupon.maxDiscount,
      minPurchase: coupon.minPurchase
    }
  });
});
