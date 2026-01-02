import asyncHandler from 'express-async-handler';
import Product from '../models/Product.model.js';
import Wishlist from '../models/Wishlist.model.js';

/**
 * =========================================================
 * @desc    Get User Wishlist
 * @route   GET /api/wishlist
 * @access  Private
 * =========================================================
 */
const getUserWishlistController = asyncHandler(async (req, res) => {
  // 🔹 Find or create wishlist
  let wishlist = await Wishlist.findOne({ userId: req.user._id }).populate({
    path: 'items.productId',
    select: 'name price image stock description category brand',
    populate: [
      { path: 'category', select: 'name' },
      { path: 'brand', select: 'name' },
    ],
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId: req.user._id, items: [] });
  }

  res.status(200).json({
    success: true,
    count: wishlist.items.length,
    data: wishlist.items,
  });
});

/**
 * =========================================================
 * @desc    Add Product to Wishlist (Toggle)
 * @route   POST /api/wishlist/add
 * @access  Private
 * =========================================================
 */
const addToWishlistController = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  // 🔹 Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // 🔹 Find or create wishlist
  let wishlist = await Wishlist.findOne({ userId: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ userId: req.user._id, items: [] });
  }

  // 🔹 Check if product already exists
  const index = wishlist.items.findIndex(
    (item) => item.productId.toString() === productId,
  );

  if (index !== -1) {
    // If exists, remove (toggle off)
    wishlist.items.splice(index, 1);
    await wishlist.save();
    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      data: wishlist.items,
    });
  }

  // 🔹 Add product to wishlist
  wishlist.items.push({ productId });
  await wishlist.save();

  res.status(201).json({
    success: true,
    message: 'Product added to wishlist',
    data: wishlist.items,
  });
});

/**
 * =========================================================
 * @desc    Remove Product from Wishlist
 * @route   DELETE /api/wishlist/remove/:productId
 * @access  Private
 * =========================================================
 */
const removeFromWishlistController = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  let wishlist = await Wishlist.findOne({ userId: req.user._id });
  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }

  // 🔹 Remove product
  wishlist.items = wishlist.items.filter(
    (item) => item.productId.toString() !== productId,
  );

  await wishlist.save();

  res.status(200).json({
    success: true,
    message: 'Product removed from wishlist',
    data: wishlist.items,
  });
});

/**
 * =========================================================
 * @desc    Get Wishlist Products with Full Details
 * @route   GET /api/wishlist/products
 * @access  Private
 * =========================================================
 */
const getWishlistProductsController = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate({
    path: 'items.productId',
    select: 'name price image stock description category brand',
    populate: [
      { path: 'category', select: 'name' },
      { path: 'brand', select: 'name' },
    ],
  });

  if (!wishlist || wishlist.items.length === 0) {
    return res.status(200).json({
      success: true,
      count: 0,
      data: [],
    });
  }

  // 🔹 Extract populated products
  const products = wishlist.items.map((item) => item.productId);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

export {
  addToWishlistController,
  getUserWishlistController,
  getWishlistProductsController,
  removeFromWishlistController,
};
