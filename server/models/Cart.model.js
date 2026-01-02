import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    attributes: { type: Map, of: String }, // size, color, etc
    image: { type: String },
    addedAt: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'User',
    },
    items: [cartItemSchema],
  },
  { timestamps: true },
);

// Virtual field for total price
cartItemSchema.virtual('finalPrice').get(function () {
  const priceAfterDiscount =
    this.price - (this.price * (this.discount || 0)) / 100;
  return priceAfterDiscount * this.quantity;
});

export default mongoose.model('Cart', cartSchema);
