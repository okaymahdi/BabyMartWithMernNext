import express from 'express';
import {
  addToWishlistController,
  getUserWishlistController,
  getWishlistProductsController,
  removeFromWishlistController,
} from '../controllers/wishlist.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
const wishlistRoutes = express.Router();

wishlistRoutes.route('/').get(protect, getUserWishlistController);

// Add Product to Wishlist
wishlistRoutes.route('/add').post(protect, addToWishlistController);

// Remove Product from Wishlist
wishlistRoutes.route('/remove').delete(protect, removeFromWishlistController);

// Get Wishlist Products with Details
wishlistRoutes.route('/products').post(protect, getWishlistProductsController);

export default wishlistRoutes;
