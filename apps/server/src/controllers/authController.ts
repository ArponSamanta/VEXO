import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import config from '../config';
import { asyncHandler, ApiError } from '../middleware/error';
import { loginSchema, registerSchema } from '@vexo/validators';

// Generate tokens
const generateAccessToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, config.jwtSecret, { expiresIn: config.jwtExpire } as jwt.SignOptions);
};

const generateRefreshToken = (id: string): string => {
  return jwt.sign({ id }, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpire } as jwt.SignOptions);
};

// @route   POST /api/auth/register
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = registerSchema.parse(req.body);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User already exists with this email');
  }

  const user = await User.create({ name, email, password });

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());

  // Save refresh token to DB
  user.refreshToken = refreshToken;
  await user.save();

  // Set refresh token in httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    success: true,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken,
    },
  });
});

// @route   POST /api/auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is deactivated');
  }

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken,
    },
  });
});

// @route   POST /api/auth/refresh
export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new ApiError(401, 'No refresh token');
  }

  const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as { id: string };
  const user = await User.findById(decoded.id).select('+refreshToken');

  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const accessToken = generateAccessToken(user._id.toString(), user.role);

  res.json({ success: true, data: { accessToken } });
});

// @route   POST /api/auth/logout
export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: undefined });
  }

  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
});

// @route   GET /api/auth/me
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: req.user });
});

// @route   PUT /api/auth/profile
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, phone, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user!._id,
    { name, phone, avatar },
    { new: true, runValidators: true }
  );

  res.json({ success: true, data: user });
});

// @route   PUT /api/auth/change-password
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current password and new password are required');
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters');
  }

  const user = await User.findById(req.user!._id).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password changed successfully' });
});

// @route   POST /api/auth/address
export const addAddress = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!._id);
  if (!user) throw new ApiError(404, 'User not found');

  // If this is set as default, unset other defaults
  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  user.addresses.push(req.body);
  await user.save();

  res.status(201).json({ success: true, data: user.addresses });
});

// @route   DELETE /api/auth/address/:addressId
export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!._id);
  if (!user) throw new ApiError(404, 'User not found');

  user.addresses = user.addresses.filter((addr) => (addr as any)._id?.toString() !== req.params.addressId);
  await user.save();

  res.json({ success: true, data: user.addresses });
});


// @route   GET /api/auth/users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({}).select('-password');
  res.json({ success: true, data: users });
});

// @route   PUT /api/auth/users/:id/role
export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.body;
  if (!['customer', 'admin', 'superadmin'].includes(role)) {
    throw new ApiError(400, 'Invalid role');
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  user.role = role;
  await user.save();

  res.json({ success: true, data: user });
});

// @route   PUT /api/auth/users/:id/status
export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { isActive } = req.body;
  if (typeof isActive !== 'boolean') {
    throw new ApiError(400, 'Invalid active status');
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  // Prevent superadmin from deactivating themselves
  if (user._id.toString() === req.user!._id.toString()) {
    throw new ApiError(400, 'Super admin cannot deactivate themselves');
  }

  user.isActive = isActive;
  await user.save();

  res.json({ success: true, data: user });
});

// @route   POST /api/auth/users/admin
export const createAdminUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(400, 'User already exists');

  const admin = await User.create({
    name,
    email,
    password,
    role: 'admin',
    isActive: true,
  });

  res.status(201).json({
    success: true,
    data: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
    },
  });
});
