import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

// Routes
import path from 'path';
import { fileURLToPath } from 'url';
import { specs } from '../config/swagger.js';
import errorHandler from '../middlewares/error.Middleware.js';
import indexRouter, {
  analyticsRoutes,
  authRoutes,
  bannerRoutes,
  brandRoutes,
  cartRoutes,
  categoryRoutes,
  orderRoutes,
  paymentRoutes,
  productRoutes,
  statsRoutes,
  userRoutes,
  wishlistRoutes,
} from '../routes/index.routes.js';

// __dirname fix for ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Public folder serve করা
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/**
 * 🌐 CORS Middleware
 */

// 🔒 CORS restricted
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman / Mobile Apps

      if (process.env.NODE_ENV === 'development') return callback(null, true);

      const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL];
      if (allowedOrigins.includes(origin)) return callback(null, true);

      callback(new Error('❌ Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

/**
 * 📦 JSON Body Parser
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/**
 * 🔗 Routes
 */
app.use('/', indexRouter); // 🏠 Home & Health
app.use('/api/auth', authRoutes); // 🔑 Auth
app.use('/api/users', userRoutes); // 👥 Users
// Products Routes
app.use('/api/products', productRoutes);
// Brand Routes
app.use('/api/brands', brandRoutes);
// Category Routes
app.use('/api/categories', categoryRoutes);
// Banner Routes
app.use('/api/banners', bannerRoutes);
// Stats Routes
app.use('/api/stats', statsRoutes);
// Orders Routes
app.use('/api/orders', orderRoutes);
// Wishlist Routes
app.use('/api/wishlists', wishlistRoutes);
// Cart Routes
app.use('/api/carts', cartRoutes);
// Payment Routes
app.use('/api/payments', paymentRoutes);
// Analytics Routes
app.use('/api/analytics', analyticsRoutes);

/**
 * 📖 API Documentation
 */
// 🛠 Swagger route
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'BabyShop API Documentation',
  }),
);

/**
 * ⚠️ Global Error Handler
 */
app.use(errorHandler);

export default app;
