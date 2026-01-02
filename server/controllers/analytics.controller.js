import asyncHandler from 'express-async-handler';
import Brand from '../models/Brand.model.js';
import Category from '../models/Category.model.js';
import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';
import User from '../models/User.model.js';

/**
 * =========================================================
 * @desc    Get Admin Dashboard Statistics
 * @route   GET /api/admin/analytics
 * @access  Admin
 * =========================================================
 */
const getAnalyticsController = asyncHandler(async (req, res) => {
  // 🔹 Basic counts using Promise.all
  const [usersCount, productsCount, ordersCount, brandsCount, categoriesCount] =
    await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Brand.countDocuments(),
      Category.countDocuments(),
    ]);

  // 🔹 Total Revenue (Orders with Paid, Completed, Delivered status)
  const revenueData = await Order.aggregate([
    {
      $match: {
        status: { $in: ['Paid', 'Completed', 'Delivered'] },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$total' },
      },
    },
  ]);
  const totalRevenue = revenueData[0]?.totalRevenue ?? 0;

  // 🔹 User role distribution
  const roles = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } },
  ]);

  // 🔹 Category distribution
  const categoryData = await Product.aggregate([
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryData',
      },
    },
    { $unwind: { path: '$categoryData', preserveNullAndEmptyArrays: true } },
    { $group: { _id: '$categoryData.name', count: { $sum: 1 } } },
  ]);

  // 🔹 Brand distribution
  const brandData = await Product.aggregate([
    {
      $lookup: {
        from: 'brands',
        localField: 'brand',
        foreignField: '_id',
        as: 'brandData',
      },
    },
    { $unwind: { path: '$brandData', preserveNullAndEmptyArrays: true } },
    { $group: { _id: '$brandData.name', count: { $sum: 1 } } },
  ]);

  // 🔹 Order status breakdown
  const orderStatusStats = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // 🔹 Final Response
  res.status(200).json({
    success: true,
    data: {
      counts: {
        users: usersCount,
        products: productsCount,
        orders: ordersCount,
        brands: brandsCount,
        categories: categoriesCount,
      },
      revenue: { total: totalRevenue },
      orderStatus: orderStatusStats,
      roles: roles.map((r) => ({ role: r._id, count: r.count })),
      categories: categoryData.map((c) => ({ name: c._id, count: c.count })),
      brands: brandData.map((b) => ({ name: b._id, count: b.count })),
    },
  });
});

export { getAnalyticsController };
