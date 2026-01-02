import asyncHandler from 'express-async-handler';
import Banner from '../models/Banner.model.js';
import { bannerLogger } from '../utils/bannerLogger.js';

/**
 * =========================================================
 * @desc    Get All Active Banners (Sorted by Priority)
 * @route   GET /api/banners
 * @access  Public
 * =========================================================
 */
const getBannersController = asyncHandler(async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort({
    priority: -1,
    createdAt: -1,
  });

  // Optional Logger
  banners.forEach((banner, index) =>
    bannerLogger({
      banner,
      index: index + 1,
      event: 'Banner Found',
      success: true,
    }),
  );

  res.status(200).json({
    success: true,
    count: banners.length,
    data: banners,
  });
});

/**
 * =========================================================
 * @desc    Get Single Banner By ID
 * @route   GET /api/banners/:id
 * @access  Public
 * =========================================================
 */
const getBannerByIdController = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }

  // Optional Logger
  bannerLogger({ banner, event: 'Banner Found ', success: true });
  res.status(200).json({
    success: true,
    data: banner,
  });
});

/**
 * =========================================================
 * @desc    Create New Banner
 * @route   POST /api/banners
 * @access  Admin
 * =========================================================
 */
const createBannerController = asyncHandler(async (req, res) => {
  const {
    name,
    title,
    description,
    startFrom,
    endAt,
    image,
    bannerType,
    priority = 0,
    link,
    tags = [],
  } = req.body;

  /**
   * 🔍 Required Field Validation
   */
  if (!name || !title || !startFrom || !endAt || !image || !bannerType) {
    res.status(400);
    throw new Error('Required fields missing');
  }

  /**
   * 🆕 Create Banner
   */
  const banner = await Banner.create({
    name,
    title,
    description,
    startFrom,
    endAt,
    image,
    bannerType,
    priority,
    link,
    tags,
    createdBy: req.user?._id, // protect middleware থাকলে
  });

  // Optional Logger
  bannerLogger({ banner, event: 'Banner Created Successfully', success: true });

  res.status(201).json({
    success: true,
    message: 'Banner created successfully',
    data: banner,
  });
});

/**
 * =========================================================
 * @desc    Update Existing Banner
 * @route   PUT /api/banners/:id
 * @access  Admin
 * =========================================================
 */
const updateBannerController = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }

  /**
   * ✏️ Update only provided fields
   */
  Object.keys(req.body).forEach((key) => {
    banner[key] = req.body[key];
  });

  banner.updatedBy = req.user?._id;

  const updatedBanner = await banner.save();

  // Optional Logger
  bannerLogger({
    banner: updatedBanner,
    event: 'Banner Updated Successfully',
    success: true,
  });

  res.status(200).json({
    success: true,
    message: 'Banner updated successfully',
    data: updatedBanner,
  });
});

/**
 * =========================================================
 * @desc    Delete Banner (Soft Delete)
 * @route   DELETE /api/banners/:id
 * @access  Admin
 * =========================================================
 */
const deleteBannerController = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }

  /**
   * 🗑 Soft Delete (Keep data for audit/history)
   */
  banner.isActive = false;
  banner.updatedBy = req.user?._id;
  await banner.save();

  // Optional Logger
  bannerLogger({ banner, event: 'Banner Deleted Successfully', success: true });

  res.status(200).json({
    success: true,
    message: 'Banner deleted successfully',
  });
});

export {
  createBannerController,
  deleteBannerController,
  getBannerByIdController,
  getBannersController,
  updateBannerController,
};
