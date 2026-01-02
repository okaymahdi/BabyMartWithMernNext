import asyncHandler from 'express-async-handler';
import Brand from '../models/Brand.model.js';
import Category from '../models/Category.model.js';
import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';
import User from '../models/User.model.js';

/**
 * =========================================================
 * @desc    Get Admin Dashboard Statistics
 * @route   GET /api/admin/stats
 * @access  Admin
 * =========================================================
 */
const getStatsController = asyncHandler(async (req, res) => {
  // -------------------------------
  // 1️⃣ Basic Counts
  // -------------------------------
  const [usersCount, productsCount, ordersCount, brandsCount, categoriesCount] =
    await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Brand.countDocuments(),
      Category.countDocuments(),
    ]);

  // -------------------------------
  // 2️⃣ Total Revenue (Paid + Completed + Delivered)
  // -------------------------------
  const revenueData = await Order.aggregate([
    {
      $match: {
        status: { $in: ['Paid', 'Completed', 'Delivered'] }, // Capitalized
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

  // -------------------------------
  // 3️⃣ User Role Distribution
  // -------------------------------
  const roles = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } },
  ]);

  // -------------------------------
  // 4️⃣ Category Distribution
  // -------------------------------
  const categoryData = await Product.aggregate([
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryData',
      },
    },
    {
      $unwind: {
        path: '$categoryData',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: '$categoryData.name',
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  // -------------------------------
  // 5️⃣ Brand Distribution
  // -------------------------------
  const brandData = await Product.aggregate([
    {
      $lookup: {
        from: 'brands',
        localField: 'brand',
        foreignField: '_id',
        as: 'brandData',
      },
    },
    {
      $unwind: {
        path: '$brandData',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: '$brandData.name',
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  // -------------------------------
  // 6️⃣ Order Status Breakdown
  // -------------------------------
  const orderStatusStats = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  // -------------------------------
  // 7️⃣ Final Response
  // -------------------------------
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
      orderStatus: orderStatusStats.map((stat) => ({
        status: stat._id,
        count: stat.count,
      })),
      roles: roles.map((role) => ({
        role: role._id,
        count: role.count,
      })),
      categories: categoryData.map((category) => ({
        name: category._id,
        count: category.count,
      })),
      brands: brandData.map((brand) => ({
        name: brand._id,
        count: brand.count,
      })),
    },
  });
});

export { getStatsController };
