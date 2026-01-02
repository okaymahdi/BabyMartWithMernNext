import mongoose from 'mongoose';

// ==========================
// Product Schema
// ==========================
const productSchema = new mongoose.Schema(
  {
    // 🔹 Basic Info
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    // 🔹 Pricing
    price: {
      type: Number,
      required: true,
      default: 0.0,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 90,
    },

    // 🔹 Stock
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // 🔹 References
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Brand',
    },

    // 🔹 Images
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (urls) {
          return urls.every((url) => /^https?:\/\/.+/.test(url));
        },
        message: 'All images must be valid URLs',
      },
    },

    // 🔹 Ratings & Reviews
    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        createAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, maxlength: 1000 },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // 🔹 Misc
    tags: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    SKU: {
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ['available', 'out-of-stock', 'discontinued'],
      default: 'available',
    },

    // 🔹 Audit
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ==========================
// Virtuals
// ==========================
productSchema.virtual('discountedPrice').get(function () {
  return this.price - (this.price * this.discountPercentage) / 100;
});

// ==========================
// Pre-save Hook
// Calculate average rating
// ==========================
productSchema.pre('save', async function () {
  if (this.reviews && this.reviews.length > 0) {
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.averageRating = total / this.reviews.length;
  } else {
    this.averageRating = 0;
  }
});

// ==========================
// Indexes
// ==========================
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ tags: 1 });

// ==========================
// Export Model
// ==========================
const Product = mongoose.model('Product', productSchema);
export default Product;
