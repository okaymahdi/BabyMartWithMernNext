import express from 'express';
import {
  createProductController,
  deleteProductController,
  getProductByIdController,
  getProductsController,
  updateProductController,
} from '../controllers/product.controller.js';
import { admin, protect } from '../middlewares/auth.middleware.js';

const productRoutes = express.Router();

// Create Products
productRoutes
  .route('/')
  .get(getProductsController)
  .post(protect, admin, createProductController);

// Get Product By ID
productRoutes
  .route('/:id')
  .get(protect, admin, getProductByIdController)
  .put(protect, admin, updateProductController)
  .delete(protect, admin, deleteProductController);

export default productRoutes;
