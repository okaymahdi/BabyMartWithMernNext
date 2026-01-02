import jwt from 'jsonwebtoken';

/**
 * 🔑 Generate JWT Token
 * @param {string} userId - MongoDB user _id
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // ✅ function parameter ব্যবহার
    process.env.JWT_SECRET, // 🔐 secret
    { expiresIn: '7d' }, // ⏳ expiry
  );
};

export default generateToken;
