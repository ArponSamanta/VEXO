import { Request, Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import Coupon from '../models/Coupon';
import { asyncHandler, ApiError } from '../middleware/error';

// @route   POST /api/orders
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { shippingAddress, paymentMethod, couponCode } = req.body;
  const cart = await Cart.findOne({ user: req.user!._id }).populate('items.product');
  if (!cart || cart.items.length === 0) throw new ApiError(400, 'Cart is empty');

  let itemsPrice = 0;
  const orderItems = cart.items.map((item: any) => {
    const product = item.product;
    if (product.stock < item.quantity) throw new ApiError(400, `${product.name} is out of stock`);
    itemsPrice += product.price * item.quantity;
    return { product: product._id, name: product.name, image: product.images[0] || '', quantity: item.quantity, price: product.price };
  });

  const taxPrice = Math.round(itemsPrice * 0.18 * 100) / 100;
  const shippingPrice = itemsPrice > 500 ? 0 : 49;
  let discountAmount = 0;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true, expiresAt: { $gt: new Date() } });
    if (coupon && itemsPrice >= coupon.minPurchase && coupon.usedCount < coupon.usageLimit) {
      discountAmount = coupon.type === 'percentage' ? Math.min((itemsPrice * coupon.value) / 100, coupon.maxDiscount || Infinity) : coupon.value;
      coupon.usedCount += 1;
      await coupon.save();
    }
  }

  const totalPrice = Math.round((itemsPrice + taxPrice + shippingPrice - discountAmount) * 100) / 100;
  const order = await Order.create({ user: req.user!._id, items: orderItems, shippingAddress, paymentMethod, paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending', itemsPrice, taxPrice, shippingPrice, discountAmount, totalPrice, couponCode });

  // Reduce stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }

  // Clear cart
  cart.items = [];
  await cart.save();

  res.status(201).json({ success: true, data: order });
});

// @route   GET /api/orders
export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const total = await Order.countDocuments({ user: req.user!._id });
  const orders = await Order.find({ user: req.user!._id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
  res.json({ success: true, data: { data: orders, page, limit, total, totalPages: Math.ceil(total / limit) } });
});

// @route   GET /api/orders/:id
export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user!._id });
  if (!order) throw new ApiError(404, 'Order not found');
  res.json({ success: true, data: order });
});

// @route   PUT /api/orders/:id/cancel
export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user!._id });
  if (!order) throw new ApiError(404, 'Order not found');
  if (!['pending', 'confirmed'].includes(order.status)) throw new ApiError(400, 'Cannot cancel this order');
  order.status = 'cancelled';
  order.statusHistory.push({ status: 'cancelled', timestamp: new Date(), note: 'Cancelled by customer' });
  await order.save();
  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
  }
  res.json({ success: true, data: order });
});

// ==================== ADMIN ====================
// @route   GET /api/orders/admin/all
export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const status = req.query.status as string;
  const query: any = {};
  if (status) query.status = status;
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query).populate('user', 'name email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
  res.json({ success: true, data: { data: orders, page, limit, total, totalPages: Math.ceil(total / limit) } });
});

// @route   PUT /api/orders/admin/:id/status
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  order.status = status;
  order.statusHistory.push({ status, timestamp: new Date(), note });
  if (status === 'delivered') order.deliveredAt = new Date();
  await order.save();
  res.json({ success: true, data: order });
});
