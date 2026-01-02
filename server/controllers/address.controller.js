import asyncHandler from 'express-async-handler';
import User from '../models/User.model.js';
import { userLogger } from '../utils/userLogger.js'; // assuming logger is in utils/logger.js
// 🔹 Add Address Controller
const addAddressController = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Only allow user to modify their own addresses or admin
  if (
    user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to add address for this user');
  }

  // Destructure request body
  const { street, city, state, country, postalCode, isDefault } = req.body;

  if (!street || !city || !state || !country || !postalCode) {
    res.status(400);
    throw new Error('All address fields are required');
  }

  // If this set as Default, make other addresses non-default
  if (isDefault) {
    user.addresses.forEach((address) => {
      address.isDefault = false;
    });
  }

  // If this is the first address, set as default
  if (user.addresses.length === 0) {
    user.addresses.push({
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country.trim(),
      postalCode: postalCode.trim(),
      isDefault: true,
    });
  } else {
    user.addresses.push({
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country.trim(),
      postalCode: postalCode.trim(),
      isDefault: isDefault || false,
    });
  }

  await user.save();

  // 🔹 Log the event
  userLogger({
    user,
    event: 'Address Added',
    mode: 'pretty',
    success: true,
  });

  res.status(201).json({
    success: true,
    message: 'Address added successfully',

    user,
  });
});

// Update Address Controller

const updateAddressController = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (
    user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  const { street, city, state, country, postalCode, isDefault } = req.body;

  if (street) address.street = street.trim();
  if (city) address.city = city.trim();
  if (state) address.state = state.trim();
  if (country) address.country = country.trim();
  if (postalCode) address.postalCode = postalCode.trim();

  // ✅ Robust default logic
  if (isDefault !== undefined) {
    const makeDefault = isDefault === true || isDefault === 'true';

    if (makeDefault) {
      user.addresses.forEach((a) => {
        a.isDefault = a._id.equals(address._id);
      });
    } else {
      address.isDefault = false;
    }
  }

  await user.save();

  userLogger({
    user,
    event: 'Address Updated Successfully',
    success: true,
  });

  res.status(200).json({
    success: true,
    message: 'Address updated successfully',
  });
});

// Delete Address Controller
const deleteAddressController = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Only allow the owner or admin to delete
  if (
    user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to delete address for this user');
  }

  // Find address using Mongoose subdocument helper
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  const wasDefault = address.isDefault;

  // Remove the address
  user.addresses.pull(req.params.addressId);

  // If deleted address was default, set first address as default
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  // Log the deletion
  userLogger({
    user,
    event: 'Address Deleted Successfully',
    mode: 'pretty',
    success: true,
  });

  res.status(200).json({
    success: true,
    message: 'Address deleted successfully',
    user,
  });
});

export {
  addAddressController,
  deleteAddressController,
  updateAddressController,
};
