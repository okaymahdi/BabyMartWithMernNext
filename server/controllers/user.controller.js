import asyncHandler from 'express-async-handler';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.model.js';
import { userLogger } from '../utils/userLogger.js';

// ES Module __dirname fix
// ES Module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET /api/users
const getAllUsersController = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');

  users.forEach((user, index) => {
    userLogger({
      user,
      index,
      event: 'User Listed (Dashboard)',
      mode: 'pretty',
      success: true,
    });
  });

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// GET /api/users/:id
const getUserByIdController = asyncHandler(async (req, res) => {
  const user = await User.find({}).select(
    process.env.NODE_ENV === 'development' ? '+password' : '-password',
  );
  if (user) {
    res.status(200).json({
      success: true,
      user,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Create User
const createUserController = asyncHandler(async (req, res) => {
  const { name, email, password, role, addresses, avatar } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  let avatarUrl = '';
  if (avatar) {
    const matches = avatar.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (matches) {
      const ext = matches[1];
      const data = Buffer.from(matches[2], 'base64');
      const filename = `${Date.now()}.${ext}`;
      fs.writeFileSync(path.join(__dirname, '../uploads', filename), data);
      avatarUrl = `/uploads/${filename}`;
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    avatar: avatarUrl || avatar, // যদি file save হয় → avatarUrl, নাহলে frontend base64
    addresses: addresses || [],
  });

  if (user) {
    res.status(201).json({
      success: true,
      user,
    });

    try {
      userLogger({
        user,
        event: 'User Created via Admin Successfully!',
        mode: 'pretty',
      });
    } catch (error) {
      console.error('User Logger Error:', error);
    }
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Update User
const updateUserController = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update fields
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.user.role === 'admin' && req.body.role) {
    user.role = req.body.role;
  }
  if (req.body.password) {
    user.password = req.body.password;
  }
  if (req.body.addresses) {
    user.addresses = req.body.addresses;
  }

  const updatedUser = await user.save();

  // 🔹 Logger BEFORE sending response
  userLogger({
    user: updatedUser,
    event: 'User Updated Successfully',
    mode: 'pretty',
    success: true,
  });

  res.status(200).json({
    success: true,
    updatedUser,
  });
});

// Delete User
const deleteUserController = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Delete User's Cart
  // Delete User's Orders (if any)

  await user.deleteOne();

  // 🔹 Logger BEFORE response
  userLogger({
    user,
    event: 'User Deleted Successfully',
    mode: 'pretty',
    success: true, // ✅ explicit
  });

  // 🔹 Response LAST
  res.status(200).json({
    success: true,
    message: 'User removed successfully',
  });
});

export {
  createUserController,
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
};
