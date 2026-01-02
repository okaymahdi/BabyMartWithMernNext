import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';

/**
 * =========================================================
 * @desc    Get User Cart
 * @route   GET /api/cart
 * @access  Private
 * =========================================================
 */
const getUserCartController = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id }).populate({
    path: 'items.product',
    select: 'name price image stock',
  });

  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, items: [] });
  }

  res.status(200).json({
    success: true,
    count: cart.items.length,
    data: cart.items,
  });
});

/**
 * =========================================================
 * @desc    Add / Update Product in Cart
 * - If product exists, update quantity
 * - If not, add new product
 * @route   POST /api/cart/add
 * @access  Private
 * =========================================================
 */
const addToCartController = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, attributes } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, items: [] });
  }

  // Check if product already in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (itemIndex > -1) {
    // Update quantity
    cart.items[itemIndex].quantity += quantity;
    if (attributes) cart.items[itemIndex].attributes = attributes;
  } else {
    // Add new product
    cart.items.push({ product: productId, quantity, attributes });
  }

  await cart.save();

  res.status(201).json({
    success: true,
    message: 'Product added to cart',
    data: cart.items,
  });
});

/**
 * =========================================================
 * @desc    Update Cart Items
 * @route   PUT /api/cart
 * @access  Private (User)
 * =========================================================
 */
const updateCartController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { items } = req.body; // Expecting [{ productId, quantity, attributes }]

  // ❌ Validate request body
  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Cart items are required');
  }

  // 🔹 Fetch user's cart or create new
  let cart = await Cart.findOne({ user: userId }).populate(
    'items.product',
    'name price stock image',
  );
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // 🔹 Build updated items array
  const updatedItems = [];

  for (const item of items) {
    const { productId, quantity, attributes } = item;

    // ❌ Validate product
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${productId}`);
    }

    // ❌ Validate stock
    if (quantity > product.stock) {
      res.status(400);
      throw new Error(
        `Only ${product.stock} items in stock for ${product.name}`,
      );
    }

    // Add to updatedItems
    updatedItems.push({
      product: product._id,
      quantity,
      attributes: attributes || {},
    });
  }

  // 🔹 Replace cart items with updatedItems
  cart.items = updatedItems;
  await cart.save();

  // 🔹 Populate product details for response
  const populatedCart = await Cart.findOne({ user: userId }).populate(
    'items.product',
    'name price image stock',
  );

  res.status(200).json({
    success: true,
    message: 'Cart updated successfully',
    data: populatedCart.items,
  });
});

/**
 * =========================================================
 * @desc    Remove Product from Cart
 * @route   DELETE /api/cart/remove/:productId
 * @access  Private
 * =========================================================
 */
const removeItemFromCartController = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
  );

  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Product removed from cart',
    data: cart.items,
  });
});

/**
 * =========================================================
 * @desc    Clear Cart (Delete All Items)
 * @route   DELETE /api/cart/clear
 * @access  Private
 * =========================================================
 */
const deleteCartController = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart cleared successfully',
    data: [],
  });
});

export {
  addToCartController,
  updateCartController,
  deleteCartController,
  getUserCartController,
  removeItemFromCartController,
};
