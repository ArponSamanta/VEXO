import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { asyncHandler, ApiError } from '../middleware/error';

// @route   GET /api/cart
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  let cart = await Cart.findOne({ user: req.user!._id }).populate('items.product', 'name images price stock slug');
  if (!cart) cart = await Cart.create({ user: req.user!._id, items: [] });
  res.json({ success: true, data: cart });
});

// @route   POST /api/cart
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw new ApiError(404, 'Product not found');
  if (product.stock < quantity) throw new ApiError(400, `Only ${product.stock} in stock`);

  let cart = await Cart.findOne({ user: req.user!._id });
  if (!cart) cart = new Cart({ user: req.user!._id, items: [] });

  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (existing) {
    existing.quantity += quantity;
    existing.price = product.price;
  } else {
    cart.items.push({ product: productId, quantity, price: product.price });
  }

  await cart.save();
  await cart.populate('items.product', 'name images price stock slug');
  res.json({ success: true, data: cart });
});

// @route   PUT /api/cart/:itemId
export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const cart = await Cart.findOne({ user: req.user!._id });
  if (!cart) throw new ApiError(404, 'Cart not found');
  const item = cart.items.find((i) => (i as any)._id?.toString() === req.params.itemId);
  if (!item) throw new ApiError(404, 'Item not found');
  item.quantity = req.body.quantity;
  await cart.save();
  await cart.populate('items.product', 'name images price stock slug');
  res.json({ success: true, data: cart });
});

// @route   DELETE /api/cart/:itemId
export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await Cart.findOne({ user: req.user!._id });
  if (!cart) throw new ApiError(404, 'Cart not found');
  cart.items = cart.items.filter((i) => (i as any)._id?.toString() !== req.params.itemId);
  await cart.save();
  await cart.populate('items.product', 'name images price stock slug');
  res.json({ success: true, data: cart });
});

// @route   DELETE /api/cart
export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await Cart.findOne({ user: req.user!._id });
  if (cart) { cart.items = []; await cart.save(); }
  res.json({ success: true, data: cart });
});
