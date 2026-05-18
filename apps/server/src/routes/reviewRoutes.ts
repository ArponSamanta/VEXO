import { Router } from 'express';
import { deleteReview } from '../controllers/reviewController';
import { protect } from '../middleware/auth';

const router = Router();

router.delete('/:id', protect, deleteReview);

export default router;
