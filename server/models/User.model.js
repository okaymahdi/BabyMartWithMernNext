import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // hide password by default
      minlength: 6,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'manager'],
      default: 'user',
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    addresses: [
      {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
    wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  },
  { timestamps: true },
);

// 🔑 Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔒 Pre-save hook: hash password, set avatar default, ensure 1 default address
userSchema.pre('save', async function () {
  // Hash password if modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Ensure avatar default
  // ✅ Avatar default based on gender
  if (!this.avatar) {
    if (this.gender === 'male') {
      this.avatar =
        'https://plus.unsplash.com/premium_photo-1664536392779-049ba8fde933?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D';
    } else if (this.gender === 'female') {
      this.avatar =
        'https://plus.unsplash.com/premium_photo-1670884441012-c5cf195c062a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D';
    }
  }
  if (!this.avatar) {
    if (this.gender === 'male') {
      this.avatar =
        'https://plus.unsplash.com/premium_photo-1664536392779-049ba8fde933?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D';
    } else if (this.gender === 'female') {
      this.avatar =
        'https://plus.unsplash.com/premium_photo-1670884441012-c5cf195c062a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D';
    } else {
      this.avatar =
        'https://images.unsplash.com/photo-1728577740843-5f29c7586afe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXZhdGFyfGVufDB8fDB8fHww';
    }
  }
  // Ensure only 1 default address
  if (this.addresses && this.addresses.length > 0) {
    const newDefault = this.addresses.find(
      (addr) => addr.isDefault && addr.isModified('isDefault'),
    );
    if (newDefault) {
      this.addresses.forEach((addr) => {
        if (!addr._id.equals(newDefault._id)) addr.isDefault = false;
      });
    } else if (!this.addresses.some((addr) => addr.isDefault)) {
      // যদি কোনো address default না থাকে, প্রথমটিকে default set করুন
      this.addresses[0].isDefault = true;
    }
  }
});

const User = mongoose.model('User', userSchema);
export default User;
