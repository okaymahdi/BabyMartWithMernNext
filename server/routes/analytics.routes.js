import express from 'express';
import { getAnalyticsController } from '../controllers/analytics.controller.js';
import { admin, protect } from '../middlewares/auth.middleware.js';

const analyticsRoutes = express.Router();

// 🔹 Admin-only route to fetch dashboard statistics
analyticsRoutes.get('/admin/analytics', protect, admin, getAnalyticsController);

export default analyticsRoutes;
