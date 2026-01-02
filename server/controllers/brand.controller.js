import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinary.js';
import Brand from '../models/Brand.model.js';
import { brandLogger } from '../utils/brandLogger.js';

/* ======================================================
   @desc    Get all brands
   @route   GET /api/brands
   @access  Private
====================================================== */
const getBrandsController = asyncHandler(async (req, res) => {
  const brands = await Brand.find({}).sort({ createdAt: -1 });

  brands.forEach((brand, index) => {
    brandLogger({
      brand,
      index: index + 1,
      event: 'GET_BRAND',
      success: true,
    });
  });

  res.status(200).json({
    success: true,
    count: brands.length,
    data: brands,
  });
});

/* ======================================================
   @desc    Get brand by ID
   @route   GET /api/brands/:id
   @access  Private
====================================================== */
const getBrandByIdController = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    brandLogger({
      brand: null,
      event: 'GET_BRAND_BY_ID',
      success: false,
    });

    res.status(404);
    throw new Error('Brand not found');
  }

  brandLogger({
    brand,
    event: 'GET_BRAND_BY_ID',
    success: true,
  });

  res.status(200).json({
    success: true,
    data: brand,
  });
});

/* ======================================================
   @desc    Create a brand
   @route   POST /api/brands
   @access  Private/Admin
====================================================== */
const createBrandController = asyncHandler(async (req, res) => {
  const { name, image } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Brand name is required');
  }

  const brandExists = await Brand.findOne({
    name: { $regex: `^${name}$`, $options: 'i' },
  });

  if (brandExists) {
    res.status(400);
    throw new Error('Brand already exists');
  }

  let imageUrl = '';

  if (image) {
    try {
      const result = await cloudinary.uploader.upload(image, {
        folder: 'admin-dashboard/brands',
      });
      imageUrl = result.secure_url;
    } catch (err) {
      res.status(500);
      throw new Error('Image upload failed');
    }
  }

  const brand = await Brand.create({
    name,
    image: imageUrl,
  });

  brandLogger({
    brand,
    event: 'CREATE_BRAND',
    success: true,
  });

  res.status(201).json({
    success: true,
    message: 'Brand created successfully',
    data: brand,
  });
});

/* ======================================================
   @desc    Update a brand
   @route   PUT /api/brands/:id
   @access  Private/Admin
====================================================== */
const updateBrandController = asyncHandler(async (req, res) => {
  const { name, image } = req.body;
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }

  // 🔄 Update image
  if (image) {
    try {
      if (brand.image) {
        const publicId = brand.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`admin-dashboard/brands/${publicId}`);
      }

      const result = await cloudinary.uploader.upload(image, {
        folder: 'admin-dashboard/brands',
      });

      brand.image = result.secure_url;
    } catch (err) {
      res.status(500);
      throw new Error('Image update failed');
    }
  }

  brand.name = name || brand.name;
  const updatedBrand = await brand.save();

  brandLogger({
    brand: updatedBrand,
    event: 'UPDATE_BRAND',
    success: true,
  });

  res.status(200).json({
    success: true,
    message: 'Brand updated successfully',
    data: updatedBrand,
  });
});

/* ======================================================
   @desc    Delete a brand
   @route   DELETE /api/brands/:id
   @access  Private/Admin
====================================================== */
const deleteBrandController = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }

  // 🧹 Delete image from Cloudinary
  if (brand.image) {
    const publicId = brand.image.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`admin-dashboard/brands/${publicId}`);
  }

  await brand.deleteOne();

  brandLogger({
    brand,
    event: 'DELETE_BRAND',
    success: true,
  });

  res.status(200).json({
    success: true,
    message: 'Brand deleted successfully',
  });
});

export {
  createBrandController,
  deleteBrandController,
  getBrandByIdController,
  getBrandsController,
  updateBrandController,
};

/** ============================================================
 *   GET     /api/brands           → getBrandsController
 *   POST    /api/brands           → createBrandController (Admin)
 *   GET     /api/brands/:id       → getBrandByIdController
 *   PUT     /api/brands/:id       → updateBrandController (Admin)
 *   DELETE  /api/brands/:id       → deleteBrandController (Admin)
 * ============================================================
 */
