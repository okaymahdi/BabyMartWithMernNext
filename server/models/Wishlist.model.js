import mongoose from 'mongoose';

/**
 * =========================================================
 * Wishlist Schema
 * - Each user has one wishlist
 * - Stores references to products
 * =========================================================
 */
const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One wishlist per user
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;
