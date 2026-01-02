import express from 'express';
import {
  loginController,
  logoutController,
  profileController,
  registerController,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const authRoutes = express.Router();

/**
 * 🔑 Register User
 * POST /api/auth/register
 */
authRoutes.post('/register', registerController);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: "Login user 🔑"
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: h@h.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: 123456
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 token:
 *                   type: string
 *                 addresses:
 *                   type: array
 *                   items:
 *                     type: object
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid email or password
 */

/**
 * 🔑 Login User
 * POST /api/auth/login
 */
authRoutes.post('/login', loginController);

/**
 * Profile route and other protected routes can be added here
 * using authentication middleware as needed.
 */
authRoutes.get('/profile', protect, profileController);

// Logout Route
authRoutes.post('/logout', protect, logoutController);

export default authRoutes;
