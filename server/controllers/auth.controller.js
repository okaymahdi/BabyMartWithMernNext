// ==================================================
// 📦 IMPORTS
// ==================================================
import chalk from 'chalk'; // 🎨 colorful console log
import asyncHandler from 'express-async-handler'; // 🧯 async error handler
import jwt from 'jsonwebtoken'; // 🎟 token decode
import TokenBlacklistModel from '../models/TokenBlacklist.model.js'; // ⚠️ logged out token store
import User from '../models/User.model.js'; // 🧑‍💻 User model
import generateToken from '../utils/generateToken.js'; // 🎟 JWT token generator
import { userLogger } from '../utils/userLogger.js';

// ==================================================
// 👤 REGISTER CONTROLLER
// ==================================================
const registerController = asyncHandler(async (req, res) => {
  const { name, email, password, role, gender, addresses } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('❌ Please provide all required fields');
  } // 🚨 validation

  const userExists = await User.findOne({ email }); // 🔍 check duplicate
  if (userExists) {
    res.status(400);
    throw new Error('⚠️ User already exists, try login');
  }

  // const userCount = await User.countDocuments({}); // 📊 count existing users
  // const allowedRoles = ['user', 'manager'];
  // let finalRole = 'user';
  // if (userCount === 0) finalRole = 'admin'; // 👑 first user
  // else if (allowedRoles.includes(role)) finalRole = role; // ✅ allowed role

  const allowedRoles = ['user', 'admin', 'manager']; // ✅ অনুমোদিত role
  let finalRole = 'user'; // default

  if (role && allowedRoles.includes(role)) {
    finalRole = role; // যদি user দেওয়া role অনুমোদিত list-এ থাকে
  }

  const user = await User.create({
    name,
    email,
    password,
    gender,
    role: finalRole, // 🔒 always user role
    addresses: addresses || [],
  }); // 🧾 create user, password auto-hash

  const token = generateToken(user._id.toString()); // 🎟 generate JWT

  userLogger({
    user,
    event: 'User Registered Successfully',
    mode: 'pretty',
  }); // 🐞 debug

  res.status(201).json({
    // 📤 safe response
    _id: user._id, // 🆔 MongoDB থেকে user এর unique ID
    name: user.name, // 📝 name
    email: user.email, // 📧 email
    avatar: user.avatar || '', // 🖼  User এর avatar / empty string
    role: user.role, // 👑 role
    addresses: user.addresses || [], // 🏠 User এর addresses / empty array
    token: token, // 🎟  JWT token, authentication এর জন্য
    createdAt: new Date(user.createdAt).toLocaleString('en-BD', {
      timeZone: 'Asia/Dhaka',
    }), // ⏰ created time (BDT)
    updatedAt: new Date(user.updatedAt).toLocaleString('en-BD', {
      timeZone: 'Asia/Dhaka',
    }), // 🛠 updated time (BDT)
  });
});

// ==================================================
// 🔐 LOGIN CONTROLLER
// ==================================================
const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password'); // 🔎 include password

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('❌ Invalid email or password');
  } // ❌ invalid login

  const token = generateToken(user._id.toString()); // 🎟 generate JWT

  res.status(200).json({
    // 📤 safe response
    _id: user._id, // 🆔 user ID
    name: user.name, // 📝 name
    email: user.email, // 📧 email
    avatar: user.avatar || '', // 🖼 avatar
    role: user.role, // 👑 role
    addresses: user.addresses || [], // 🏠 addresses
    token: token, // 🎟 JWT
    loggedInAt: new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' }), // 🕒 login time
  });

  userLogger({
    user,
    event: 'User Logged In Successfully',
    mode: 'pretty', // 👈 সুন্দর block
  });
});

// ==================================================
// 👤 PROFILE CONTROLLER
// ==================================================
const profileController = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password'); // 🔒 exclude password
  if (!user) {
    res.status(404);
    throw new Error('❌ User not found');
  }
  res.status(200).json({
    // 📤 safe response
    _id: user._id, // 🆔 user ID
    name: user.name, // 📝 name
    email: user.email, // 📧 email
    avatar: user.avatar || '', // 🖼 avatar
    role: user.role, // 👑 role
    addresses: user.addresses || [], // 🏠 addresses
  });

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${chalk.green('✅ User Profile')}
${chalk.cyan('🆔 ID        :')} ${chalk.green(user._id.toString())}
${chalk.cyan('📧 Email     :')} ${chalk.magenta(user.email)}
${chalk.cyan('👑 Role      :')} ${chalk.redBright(user.role)}
${chalk.cyan('🕒 Time      :')} ${chalk.yellow(
    new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' }),
  )}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
});

// ==================================================
// 👋 LOGOUT CONTROLLER
// ==================================================
const logoutController = asyncHandler(async (req, res) => {
  const user = req.user; // 🔐 authenticated user
  const token = req.headers.authorization?.split(' ')[1]; // 🔑 get token
  if (token) {
    const decoded = jwt.decode(token); // ⏰ decode token
    const expiresAt = new Date(decoded.exp * 1000); // ⏳ expiry
    await TokenBlacklistModel.create({ token, expiresAt }); // ⚠️ blacklist token
  }
  res.status(200).json({
    success: true,
    message: '✅ User logged out successfully',
    loggedOutAt: new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' }), // 🕒 logout time
  }); // 📤 response

  userLogger({
    user,
    event: 'User Logged Out Successfully',
    mode: 'pretty',
  });
});

export {
  loginController,
  logoutController,
  profileController,
  registerController,
};
