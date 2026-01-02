import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.model.js';
import Order from '../models/Order.model.js';

/**
 * =========================================================
 * @desc    Get All Orders (Admin)
 * @route   GET /api/admin/orders
 * @access  Admin
 * =========================================================
 */
const getAllOrdersAdminController = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { status, paymentStatus } = req.query;

  // 🔹 Build filter object for admin query
  const filter = {};
  if (status && status !== 'All') filter.status = status;
  if (paymentStatus && paymentStatus !== 'All')
    filter.paymentStatus = paymentStatus;

  // 🔹 Fetch orders with pagination, sort latest first, and populate user and product info
  const orders = await Order.find(filter)
    .populate('userId', 'name email role')
    .populate('items.productId', 'name price image')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Order.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  // ✅ Return response
  res.status(200).json({
    success: true,
    total,
    totalPages,
    currentPage: page,
    data: orders,
  });
});

/**
 * =========================================================
 * @desc    Get Logged-in User Orders
 * @route   GET /api/orders
 * @access  User
 * =========================================================
 */
const getOrdersController = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .populate('items.productId', 'name price image')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

/**
 * =========================================================
 * @desc    Create Order From Cart
 * @route   POST /api/orders
 * @access  User
 * =========================================================
 */
const createOrderFromCartController = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;

  // 🔹 Validate shipping address
  if (
    !shippingAddress ||
    !shippingAddress.street ||
    !shippingAddress.city ||
    !shippingAddress.country ||
    !shippingAddress.postalCode
  ) {
    res.status(400);
    throw new Error('Complete shipping address is required');
  }

  // 🔹 Get user's cart
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'name price stock image',
  );

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  // 🔹 Build order items and calculate total
  let total = 0;
  const orderItems = cart.items.map((item) => {
    const product = item.product;

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`${product.name} is out of stock`);
    }

    // 🔹 Deduct stock immediately
    product.stock -= item.quantity;
    product.save();

    total += product.price * item.quantity;

    return {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      attributes: item.attributes || {},
    };
  });

  // 🔹 Create the order
  const order = await Order.create({
    userId: req.user._id,
    items: orderItems,
    shippingAddress,
    total,
    paymentStatus: 'Pending',
    status: 'Pending',
  });

  // 🔹 Clear user's cart after order creation
  cart.items = [];
  await cart.save();

  // ✅ Return response
  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: order,
  });
});

/**
 * =========================================================
 * @desc    Get Single Order By ID
 * @route   GET /api/orders/:id
 * @access  Admin or Owner
 * =========================================================
 */
const getOrderByIdController = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('userId', 'name email role')
    .populate('items.productId', 'name price image');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // 🔐 Authorization: Only admin or order owner
  if (
    req.user.role !== 'Admin' &&
    order.userId._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

/**
 * =========================================================
 * @desc    Update Order Status (Admin only)
 * @route   PUT /api/admin/orders/:id/status
 * @access  Admin
 * =========================================================
 */
const updateOrderStatusController = asyncHandler(async (req, res) => {
  const { status, paymentStatus, stripeSessionId, paymentIntentId } = req.body;

  // ❌ Ensure something is provided
  if (!status && !paymentStatus && !stripeSessionId && !paymentIntentId) {
    return res.status(400).json({
      success: false,
      message:
        'Nothing to update. Provide status, paymentStatus, or payment info',
    });
  }

  // 🔹 Define valid enums (Capitalized)
  const validStatus = [
    'Pending',
    'Paid',
    'Completed',
    'Delivered',
    'Cancelled',
  ];
  const validPaymentStatus = ['Pending', 'Paid', 'Failed'];

  // ❌ Validate status
  if (status && !validStatus.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatus.join(', ')}`,
    });
  }

  // ❌ Validate paymentStatus
  if (paymentStatus && !validPaymentStatus.includes(paymentStatus)) {
    return res.status(400).json({
      success: false,
      message: `Invalid paymentStatus. Must be one of: ${validPaymentStatus.join(
        ', ',
      )}`,
    });
  }

  // 🔹 Fetch order
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // 🔹 Authorization check (Admin only)
  if (req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Only Admin can update order status');
  }

  // 🔹 Prepare update object
  const updateData = {
    updatedAt: new Date(),
  };

  // 🔹 Update status and timestamps
  if (status) {
    updateData.status = status;
    if (status === 'Delivered') updateData.deliveredAt = new Date();
  }

  // 🔹 Update paymentStatus and timestamps
  if (paymentStatus) {
    updateData.paymentStatus = paymentStatus;
    if (paymentStatus === 'Paid') {
      updateData.isPaid = true;
      updateData.paidAt = new Date();
    }
  }

  // 🔹 Update stripe/payment info
  if (stripeSessionId) updateData.stripeSessionId = stripeSessionId;
  if (paymentIntentId) updateData.paymentIntentId = paymentIntentId;

  // 🔹 Apply update
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true },
  );

  res.status(200).json({
    success: true,
    message: 'Order updated successfully',
    data: updatedOrder,
  });
});

/**
 * =========================================================
 * @desc    Cancel Order (Admin)
 * @route   DELETE /api/admin/orders/:id
 * @access  Admin
 * =========================================================
 */
const deleteOrderController = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // 🔹 Soft cancel
  order.status = 'Cancelled';
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
  });
});

export {
  createOrderFromCartController,
  deleteOrderController,
  getAllOrdersAdminController,
  getOrderByIdController,
  getOrdersController,
  updateOrderStatusController,
};
