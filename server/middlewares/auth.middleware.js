import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

import TokenBlacklistModel from '../models/TokenBlacklist.model.js';
import User from '../models/User.model.js';

/**
 * ==================================================
 * 🔐 PROTECT MIDDLEWARE
 * ==================================================
 * ✅ Checks JWT from Authorization header
 * ✅ Verifies token
 * ✅ Checks blacklist (logout support)
 * ✅ Attaches user to req.user
 */
const protectedRouteMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  // 1️⃣ Authorization header আছে কিনা চেক
  // Expected format: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    // 2️⃣ Header থেকে token বের করা
    token = req.headers.authorization.split(' ')[1];
  }

  // 3️⃣ Token না থাকলে সরাসরি unauthorized
  if (!token) {
    res.status(401);
    throw new Error('❌ Not authorized, no token provided');
  }

  try {
    // 4️⃣ Token blacklist এ আছে কিনা চেক (logout support)
    const blacklisted = await TokenBlacklistModel.findOne({ token });
    if (blacklisted) {
      res.status(401);
      throw new Error('❌ Token is invalid (logged out)');
    }

    // 5️⃣ JWT verify করা
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 6️⃣ Token থেকে পাওয়া user id দিয়ে user fetch করা
    // password বাদ দিয়ে
    const user = await User.findById(decoded.id).select('-password');

    // 7️⃣ User না পাওয়া গেলে (deleted user)
    if (!user) {
      res.status(401);
      throw new Error('❌ User no longer exists');
    }

    // 8️⃣ req.user এ user attach করা
    req.user = user;

    // 9️⃣ পরের middleware / controller এ যাওয়া
    next();
  } catch (error) {
    res.status(401);
    throw new Error('❌ Not authorized, token failed');
  }
});

// Admin / Moderator role চেক middleware
const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (
    req.user &&
    (req.user.role === 'admin' || req.user.role === 'moderator')
  ) {
    next();
  } else {
    res.status(403);
    throw new Error('❌ Not authorized as an admin or moderator');
  }
});

export { adminMiddleware as admin, protectedRouteMiddleware as protect };
