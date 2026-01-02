import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must be at most 50 characters'],
    },
    image: {
      type: String, // optional
      required: false,
    },
    categoryType: {
      type: String,
      required: true,
      enum: ['Featured', 'Hot Categories', 'Top Categories', 'General'],
    },
  },
  { timestamps: true },
);

// 🔹 Pre-save hook: auto-generate slug from name
categorySchema.pre('save', async function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
