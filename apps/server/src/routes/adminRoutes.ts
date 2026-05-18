import { Router } from 'express';
import { getPlatformStats, getRevenueChart } from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect, authorize('admin', 'superadmin'));

router.get('/stats', getPlatformStats);
router.get('/revenue-chart', getRevenueChart);

export default router;
