import { Request, Response } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';
import { asyncHandler, ApiError } from '../middleware/error';
import { createReviewSchema } from '@vexo/validators';

// @route   GET /api/products/:productId/reviews
export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: reviews });
});

// @route   POST /api/products/:productId/reviews
export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const data = createReviewSchema.parse(req.body);
  const product = await Product.findById(req.params.productId);
  if (!product) throw new ApiError(404, 'Product not found');

  const existing = await Review.findOne({ user: req.user!._id, product: req.params.productId });
  if (existing) throw new ApiError(400, 'You already reviewed this product');

  const review = await Review.create({
    user: req.user!._id,
    product: req.params.productId,
    ...data,
  });

  await review.populate('user', 'name avatar');
  res.status(201).json({ success: true, data: review });
});

// @route   DELETE /api/reviews/:id
export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  if (review.user.toString() !== req.user!._id.toString() && req.user!.role === 'customer') {
    throw new ApiError(403, 'Not authorized');
  }

  const productId = review.product;
  await review.deleteOne();

  // Recalculate ratings
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, { rating: Math.round(stats[0].avgRating * 10) / 10, numReviews: stats[0].numReviews });
  } else {
    await Product.findByIdAndUpdate(productId, { rating: 0, numReviews: 0 });
  }

  res.json({ success: true, message: 'Review deleted' });
});
