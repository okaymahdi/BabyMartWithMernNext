import express from 'express';
import {
  addToCartController,
  deleteCartController,
  getUserCartController,
  removeItemFromCartController,
  updateCartController,
} from '../controllers/cart.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
const cartRoutes = express.Router();

// All Cart Protected Routes
cartRoutes.use(protect);

// Get current user's cart
cartRoutes.route('/').get(getUserCartController).delete(deleteCartController);

// Add / update product in cart
cartRoutes.post('/add', addToCartController);

// Update Cart Item Quantity
cartRoutes.route('/update').put(updateCartController);

// Remove product from cart
cartRoutes.delete('/remove/:productId', protect, removeItemFromCartController);

export default cartRoutes;
