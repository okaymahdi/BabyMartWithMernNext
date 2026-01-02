import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinary.js';
import Category from '../models/Category.model.js';
import { categoryLogger } from '../utils/categoryLogger.js';

/* ======================================================
   @desc    Get all categories (with pagination + sorting)
   @route   GET /api/categories
   @access  Private
====================================================== */
const getCategoriesController = asyncHandler(async (req, res) => {
  // 📌 Pagination params
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.limit) || 10;

  // 📌 Sorting params
  const sortOrder = req.query.sortOrder || 'asc';

  // 🔹 Validation
  if (isNaN(page) || isNaN(perPage) || page < 1 || perPage < 1) {
    res.status(400);
    throw new Error('Page and Per Page must be positive integers');
  }
  if (!['asc', 'desc'].includes(sortOrder)) {
    res.status(400);
    throw new Error('Sort Order must be either "asc" or "desc"');
  }

  const skip = (page - 1) * perPage;
  const total = await Category.countDocuments();
  const sortValue = sortOrder === 'asc' ? 1 : -1;

  // 🔹 Fetch categories
  const categories = await Category.find({})
    .skip(skip)
    .limit(perPage)
    .sort({ createdAt: sortValue });

  const totalPages = Math.ceil(total / perPage);

  // 🔹 Logger
  categories.forEach((cat, index) => {
    categoryLogger({
      category: cat,
      index: skip + index + 1,
      event: 'Category found',
      success: true,
    });
  });

  // 🔹 Response
  res.status(200).json({
    success: true,
    count: categories.length,
    data: { categories, total, page, perPage, totalPages },
  });
});

/* ======================================================
   @desc    Get category by ID
   @route   GET /api/categories/:id
   @access  Private
====================================================== */
const getCategoryByIdController = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    categoryLogger({
      category: null,
      event: 'Category not found',
      success: false,
    });
    res.status(404);
    throw new Error('Category not found');
  }

  categoryLogger({ category, event: 'Category found', success: true });

  res.status(200).json({ success: true, data: category });
});

/* ======================================================
   @desc    Create a category
   @route   POST /api/categories
   @access  Private/Admin
====================================================== */
const createCategoryController = asyncHandler(async (req, res) => {
  const { name, image, categoryType } = req.body;

  if (!name || typeof name !== 'string') {
    res.status(400);
    throw new Error('Category name is required');
  }

  //   🔹 Validation Categories
  const validateCategories = ['Featured', 'Hot Categories', 'Top Categories'];
  if (categoryType && !validateCategories.includes(categoryType)) {
    res.status(400);
    throw new Error('Invalid category type');
  }

  // 🔹 Check if already exists
  const categoryExists = await Category.findOne({
    name: { $regex: `^${name}$`, $options: 'i' },
  });
  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  // 🔹 Upload image if provided
  let imageUrl = '';
  if (image) {
    try {
      const result = await cloudinary.uploader.upload(image, {
        folder: 'admin-dashboard/categories',
      });
      imageUrl = result.secure_url;
    } catch (err) {
      res.status(500);
      throw new Error('Image upload failed');
    }
  }

  const category = await Category.create({
    name,
    image: imageUrl || undefined,
    categoryType: categoryType || 'General',
  });

  if (category) {
    categoryLogger({
      category,
      event: 'Category created successfully',
      success: true,
    });
  } else {
    categoryLogger({
      category: null,
      event: 'Category creation failed',
      success: false,
    });
  }

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category,
  });
});

/* ======================================================
   @desc    Update a category
   @route   PUT /api/categories/:id
   @access  Private/Admin
====================================================== */
const updateCategoryController = asyncHandler(async (req, res) => {
  const { name, image, categoryType } = req.body;

  // 🔹 Find category by ID
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // 🔹 Update basic fields
  if (name) category.name = name;
  if (categoryType) category.categoryType = categoryType;

  // 🔹 Update or remove image
  if (image !== undefined) {
    if (image) {
      try {
        // Delete old image if exists
        if (category.image) {
          const publicId = category.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(
            `admin-dashboard/categories/${publicId}`,
          );
        }
        // Upload new image
        const result = await cloudinary.uploader.upload(image, {
          folder: 'admin-dashboard/categories',
        });
        category.image = result.secure_url;
      } catch (err) {
        res.status(500);
        throw new Error('Image update failed');
      }
    } else {
      // Remove image if image field is empty string/null
      category.image = undefined;
    }
  }

  // 🔹 Save updated category
  const updatedCategory = await category.save();

  // 🔹 Logger
  categoryLogger({
    category: updatedCategory,
    event: 'Category Updated Successfully',
    success: true,
  });

  // 🔹 Response
  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: updatedCategory,
  });
});

/* ======================================================
   @desc    Delete a category
   @route   DELETE /api/categories/:id
   @access  Private/Admin
====================================================== */
const deleteCategoryController = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // 🔹 Delete image from Cloudinary
  if (category.image) {
    const publicId = category.image.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`admin-dashboard/categories/${publicId}`);
  }

  await category.deleteOne();

  categoryLogger({
    category,
    event: 'Category deleted Successfully!',
    success: true,
  });

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  });
});

export {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
};
