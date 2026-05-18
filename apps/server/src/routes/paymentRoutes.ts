import { Router } from 'express';
import { createPaymentOrder, verifyPayment, handleWebhook } from '../controllers/paymentController';
import { protect } from '../middleware/auth';
import express from 'express';

const router = Router();

router.post('/create-order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
