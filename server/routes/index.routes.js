import express from 'express';

const indexRouter = express.Router();

/**
 * 🏠 Home Route
 * GET /
 */
indexRouter.get('/', (req, res) => {
  res.json({
    message: '🏠 Welcome to BabyShop API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      apiDocs: '/api-docs',
    },
  });
});

/**
 * ❤️ Health Check Route
 * GET /health
 */
indexRouter.get('/health', (req, res) => {
  res.json({
    status: 'success',
    uptime: process.uptime() + ' seconds',
    timestamp: Date.now(),
    message: '💓 Server is healthy',
  });
});

export { default as analyticsRoutes } from './analytics.routes.js';
export { default as authRoutes } from './auth.routes.js';
export { default as bannerRoutes } from './banner.routes.js';
export { default as brandRoutes } from './brand.routes.js';
export { default as cartRoutes } from './cart.routes.js';
export { default as categoryRoutes } from './category.routes.js';
export { default as orderRoutes } from './order.routes.js';
export { default as paymentRoutes } from './payment.routes.js';
export { default as productRoutes } from './product.routes.js';
export { default as statsRoutes } from './stats.routes.js';
export { default as userRoutes } from './user.routes.js';
export { default as wishlistRoutes } from './wish.routes.js';
export default indexRouter;
