import asyncHandler from 'express-async-handler';
import Product from '../models/Product.model.js';
import { productLogger } from '../utils/productLogger.js';

/* ======================================================
   @desc    Create new product
   @route   POST /api/products
   @access  Private/Admin
====================================================== */
const createProductController = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    brand,
    images,
    discountPercentage,
    stock,
  } = req.body;

  try {
    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand,
      images: images || [],
      discountPercentage: discountPercentage || 0,
      stock: stock || 0,
    });

    // 🔹 Logger
    productLogger({
      product,
      event: 'PRODUCT_CREATED',
      mode: 'pretty',
      success: true,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    // Duplicate product name
    if (error.code === 11000 && error.keyPattern?.name) {
      res.status(400);
      throw new Error('Product with same name already exists');
    }

    res.status(400);
    throw new Error(error.message);
  }
});

/* ======================================================
   @desc    Get all products
   @route   GET /api/products
   @access  Public
====================================================== */
const getProductsController = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    // 👉 এখানে populate হচ্ছে
    .populate('category', 'name')
    .populate('brand', 'name')
    .sort({ createdAt: -1 });

  products.forEach((product, index) => {
    productLogger({
      product,
      index: index + 1,
      event: 'GET_PRODUCT',
      mode: 'pretty',
      success: true,
    });
  });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

/* ======================================================
   @desc    Get single product by ID
   @route   GET /api/products/:id
   @access  Public
====================================================== */
const getProductByIdController = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    // 👉 brand ও category নাম দেখাবে
    .populate('category', 'name')
    .populate('brand', 'name');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  productLogger({
    product,
    event: 'GET_PRODUCT_BY_ID',
    mode: 'pretty',
    success: true,
  });

  res.status(200).json({
    success: true,
    data: product,
  });
});

/* ======================================================
   @desc    Update product
   @route   PUT /api/products/:id
   @access  Private/Admin
====================================================== */
const updateProductController = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    brand,
    images,
    discountPercentage,
    stock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // 🔹 Field update (safe way)
  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price ?? product.price;
  product.category = category || product.category;
  product.brand = brand || product.brand;
  product.images = images ?? product.images;
  product.discountPercentage = discountPercentage ?? product.discountPercentage;
  product.stock = stock ?? product.stock;

  const updatedProduct = await product.save();

  productLogger({
    product: updatedProduct,
    event: 'PRODUCT_UPDATED',
    mode: 'pretty',
    success: true,
  });

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: updatedProduct,
  });
});

/* ======================================================
   @desc    Delete product
   @route   DELETE /api/products/:id
   @access  Private/Admin
====================================================== */
const deleteProductController = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();

  productLogger({
    product,
    event: 'PRODUCT_DELETED',
    mode: 'pretty',
    success: true,
  });

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});

/* ======================================================
   EXPORTS
====================================================== */
export {
  createProductController,
  deleteProductController,
  getProductByIdController,
  getProductsController,
  updateProductController,
};
