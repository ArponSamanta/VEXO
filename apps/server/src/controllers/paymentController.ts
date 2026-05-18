import { Request, Response } from 'express';
import crypto from 'crypto';
import Order from '../models/Order';
import config from '../config';
import { asyncHandler, ApiError } from '../middleware/error';

// @route   POST /api/payments/create-order
export const createPaymentOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.body;
  const order = await Order.findOne({ _id: orderId, user: req.user!._id });
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.paymentStatus === 'paid') throw new ApiError(400, 'Order already paid');

  // If Razorpay keys are configured, create real order
  if (config.razorpayKeyId && config.razorpayKeySecret) {
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({ key_id: config.razorpayKeyId, key_secret: config.razorpayKeySecret });
    const rpOrder = await razorpay.orders.create({
      amount: Math.round(order.totalPrice * 100),
      currency: 'INR',
      receipt: order.orderNumber,
    });
    order.razorpayOrderId = rpOrder.id;
    await order.save();
    res.json({ success: true, data: { orderId: rpOrder.id, amount: rpOrder.amount, currency: rpOrder.currency, keyId: config.razorpayKeyId } });
  } else {
    // Dev mode - simulate payment
    const fakeOrderId = `dev_${Date.now()}`;
    order.razorpayOrderId = fakeOrderId;
    await order.save();
    res.json({ success: true, data: { orderId: fakeOrderId, amount: Math.round(order.totalPrice * 100), currency: 'INR', keyId: 'dev_mode', devMode: true } });
  }
});

// @route   POST /api/payments/verify
export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
  if (!order) throw new ApiError(404, 'Order not found');

  // Dev mode bypass
  if (razorpay_order_id?.startsWith('dev_')) {
    order.paymentStatus = 'paid';
    order.paymentId = `dev_pay_${Date.now()}`;
    order.status = 'confirmed';
    order.paidAt = new Date();
    order.statusHistory.push({ status: 'confirmed', timestamp: new Date(), note: 'Payment verified (dev mode)' });
    await order.save();
    return res.json({ success: true, data: order });
  }

  // Verify signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto.createHmac('sha256', config.razorpayKeySecret).update(body).digest('hex');

  if (expectedSignature !== razorpay_signature) {
    order.paymentStatus = 'failed';
    await order.save();
    throw new ApiError(400, 'Payment verification failed');
  }

  order.paymentStatus = 'paid';
  order.paymentId = razorpay_payment_id;
  order.status = 'confirmed';
  order.paidAt = new Date();
  order.statusHistory.push({ status: 'confirmed', timestamp: new Date(), note: 'Payment verified' });
  await order.save();

  res.json({ success: true, data: order });
});

// @route   POST /api/payments/webhook
export const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  if (!signature) { res.status(400).json({ success: false }); return; }

  const body = JSON.stringify(req.body);
  const expected = crypto.createHmac('sha256', config.razorpayWebhookSecret).update(body).digest('hex');

  if (expected !== signature) { res.status(400).json({ success: false }); return; }

  const event = req.body.event;
  const payload = req.body.payload;

  if (event === 'payment.captured') {
    const rpOrderId = payload.payment.entity.order_id;
    const order = await Order.findOne({ razorpayOrderId: rpOrderId });
    if (order && order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid';
      order.paymentId = payload.payment.entity.id;
      order.status = 'confirmed';
      order.paidAt = new Date();
      order.statusHistory.push({ status: 'confirmed', timestamp: new Date(), note: 'Payment captured via webhook' });
      await order.save();
    }
  }

  res.json({ success: true });
});
