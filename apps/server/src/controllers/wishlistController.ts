import { Request, Response } from 'express';
import Wishlist from '../models/Wishlist';
import { asyncHandler, ApiError } from '../middleware/error';

// @route   GET /api/wishlist
export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  let wishlist = await Wishlist.findOne({ user: req.user!._id }).populate('products', 'name images price comparePrice slug rating');
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user!._id, products: [] });
  res.json({ success: true, data: wishlist });
});

// @route   POST /api/wishlist/:productId
export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  let wishlist = await Wishlist.findOne({ user: req.user!._id });
  if (!wishlist) wishlist = new Wishlist({ user: req.user!._id, products: [] });

  const productId = req.params.productId;
  if (wishlist.products.some((p) => p.toString() === productId)) {
    throw new ApiError(400, 'Product already in wishlist');
  }

  wishlist.products.push(productId as any);
  await wishlist.save();
  await wishlist.populate('products', 'name images price comparePrice slug rating');
  res.json({ success: true, data: wishlist });
});

// @route   DELETE /api/wishlist/:productId
export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await Wishlist.findOne({ user: req.user!._id });
  if (!wishlist) throw new ApiError(404, 'Wishlist not found');

  wishlist.products = wishlist.products.filter((p) => p.toString() !== req.params.productId);
  await wishlist.save();
  await wishlist.populate('products', 'name images price comparePrice slug rating');
  res.json({ success: true, data: wishlist });
});
