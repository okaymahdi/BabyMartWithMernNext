import express from 'express';
import {
  createBannerController,
  deleteBannerController,
  getBannersController,
  updateBannerController,
} from '../controllers/banner.controller.js';
import { admin, protect } from '../middlewares/auth.middleware.js';

const bannerRoutes = express.Router();
/**
 * Public Routes
 */
bannerRoutes
  .route('/')
  .get(getBannersController)
  .post(protect, admin, createBannerController);

/**
 * Admin Routes
 */
bannerRoutes
  .route('/:id')
  .get(protect, getBannersController)
  .put(protect, admin, updateBannerController)
  .delete(protect, admin, deleteBannerController);

export default bannerRoutes;
