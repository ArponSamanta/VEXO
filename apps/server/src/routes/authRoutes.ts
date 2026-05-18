import { Router } from 'express';
import {
  register,
  login,
  refreshAccessToken,
  logout,
  getMe,
  updateProfile,
  changePassword,
  addAddress,
  deleteAddress,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  createAdminUser,
} from '../controllers/authController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/address', protect, addAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.get('/users', protect, authorize('admin', 'superadmin'), getAllUsers);

// Superadmin administrative endpoints
router.put('/users/:id/role', protect, authorize('superadmin'), updateUserRole);
router.put('/users/:id/status', protect, authorize('superadmin'), updateUserStatus);
router.post('/users/admin', protect, authorize('superadmin'), createAdminUser);

export default router;
