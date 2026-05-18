import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import Coupon from '../models/Coupon';
import { asyncHandler } from '../middleware/error';

// @route   GET /api/admin/stats
export const getPlatformStats = asyncHandler(async (_req: Request, res: Response) => {
  const [
    totalUsers,
    totalCustomers,
    totalAdmins,
    totalSuperadmins,
    totalProducts,
    activeProducts,
    lowStockProducts,
    totalOrders,
    pendingOrders,
    totalCoupons,
    revenueAgg,
    recentOrders,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ role: 'superadmin' }),
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ stock: { $lte: 10 }, isActive: true }),
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Coupon.countDocuments(),
    Order.aggregate([
      { $match: { status: { $nin: ['cancelled', 'returned'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]),
    Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber totalPrice status paymentStatus createdAt user'),
  ]);

  const totalRevenue = revenueAgg[0]?.totalRevenue ?? 0;

  res.json({
    success: true,
    data: {
      totalUsers,
      totalCustomers,
      totalAdmins,
      totalSuperadmins,
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      totalCoupons,
      totalRevenue,
      recentOrders,
    },
  });
});

// @route   GET /api/admin/revenue-chart
export const getRevenueChart = asyncHandler(async (_req: Request, res: Response) => {
  const days = 7;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (days - 1));
  startDate.setHours(0, 0, 0, 0);

  const dailyData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $nin: ['cancelled', 'returned'] },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const chartData = [];

  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const key = d.toISOString().split('T')[0];
    const found = dailyData.find((row) => row._id === key);
    chartData.push({
      name: dayLabels[d.getDay()],
      date: key,
      revenue: found?.revenue ?? 0,
      orders: found?.orders ?? 0,
    });
  }

  res.json({ success: true, data: chartData });
});
