import mongoose from 'mongoose';

// =======================
// Order Item Schema
// =======================
const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    attributes: { type: Map, of: String },
    addedAt: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// Virtual for total price per order item
orderItemSchema.virtual('finalPrice').get(function () {
  return this.price * this.quantity;
});

// =======================
// Order Schema
// =======================
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
      postalCode: { type: String, required: true, trim: true },
    },
    paymentIntentId: { type: String },
    stripeSessionId: { type: String },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Online'], // Capitalized
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'], // Capitalized
      default: 'Pending',
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Completed', 'Delivered', 'Cancelled'], // Capitalized
      default: 'Pending',
    },
    total: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true },
);

// Pre-save hook to calculate total automatically
orderSchema.pre('save', function (next) {
  if (this.items && this.items.length > 0) {
    this.total = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
