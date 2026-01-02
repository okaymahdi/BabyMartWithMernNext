import express from 'express';
import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from '../controllers/category.controller.js';
import { admin, protect } from '../middlewares/auth.middleware.js';

const categoryRoutes = express.Router();

// Get All Categories
categoryRoutes
  .route('/')
  .get(getCategoriesController)
  .post(protect, admin, createCategoryController);

// Get Category By ID
categoryRoutes
  .route('/:id')
  .get(protect, admin, getCategoryByIdController)
  .put(protect, admin, updateCategoryController)
  .delete(protect, admin, deleteCategoryController);

export default categoryRoutes;
