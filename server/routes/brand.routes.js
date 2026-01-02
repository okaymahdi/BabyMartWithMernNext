import express from 'express';
import {
  createBrandController,
  deleteBrandController,
  getBrandByIdController,
  getBrandsController,
  updateBrandController,
} from '../controllers/brand.controller.js';
import { admin, protect } from '../middlewares/auth.middleware.js';

const brandRoutes = express.Router();

brandRoutes
  .route('/')
  .get(getBrandsController)
  .post(protect, admin, createBrandController);

brandRoutes
  .route('/:id')
  .get(getBrandByIdController)
  .put(protect, admin, updateBrandController)
  .delete(protect, admin, deleteBrandController);

export default brandRoutes;
