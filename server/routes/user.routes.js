import express from 'express';
import {
  addAddressController,
  deleteAddressController,
  updateAddressController,
} from '../controllers/address.controller.js';
import {
  createUserController,
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
} from '../controllers/user.controller.js';
import { admin, protect } from '../middlewares/auth.middleware.js';

const userRoutes = express.Router();

// '/' - Dashboard - All Users (Admin)
// '/api' - User Management
userRoutes
  .route('/')
  .get(protect, admin, getAllUsersController)
  .post(protect, admin, createUserController);

// '/:id' - User ID - Single User (Admin)
// Route Example: /api/users/6950d054f8571b41e3f87792 - Get, Update, Delete User by ID
userRoutes
  .route('/:id')
  .get(protect, getUserByIdController)
  .put(protect, updateUserController)
  .delete(protect, admin, deleteUserController);

// '/:id/address' - User Address Management
userRoutes.route('/:id/address').post(protect, addAddressController);

// '/:id/address/:addressId' - Specific Address Management
userRoutes
  .route('/:id/address/:addressId')
  .put(protect, updateAddressController)
  .delete(protect, deleteAddressController);

export default userRoutes;
