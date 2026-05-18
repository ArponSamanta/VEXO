import { Router } from 'express';
import { createOrder, getMyOrders, getOrder, cancelOrder, getAllOrders, updateOrderStatus } from '../controllers/orderController';
import { protect, authorize } from '../middleware/auth';

const router = Router();
router.use(protect);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/admin/all', authorize('admin', 'superadmin'), getAllOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);
router.put('/admin/:id/status', authorize('admin', 'superadmin'), updateOrderStatus);

export default router;
