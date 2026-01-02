import express from 'express';
import {
  createOrderFromCartController,
  deleteOrderController,
  getAllOrdersAdminController,
  getOrderByIdController,
  getOrdersController,
  updateOrderStatusController,
} from '../controllers/order.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const orderRoutes = express.Router();

orderRoutes.route('/admin').get(protect, getAllOrdersAdminController);

orderRoutes
  .route('/')
  .get(protect, getOrdersController)
  .post(protect, createOrderFromCartController);

orderRoutes
  .route('/:id')
  .get(protect, getOrderByIdController)
  .delete(protect, deleteOrderController);

orderRoutes
  .route('/:id/webhook-status')
  .put(protect, updateOrderStatusController);

export default orderRoutes;
