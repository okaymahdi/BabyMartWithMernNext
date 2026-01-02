import asyncHandler from 'express-async-handler';
import Order from '../models/Order.model.js';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * =========================================================
 * @desc    Create Stripe Payment Intent
 * @route   POST /api/payment/create-payment-intent
 * @access  Private
 * =========================================================
 */
const createPaymentIntentController = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    res.status(400);
    throw new Error('Order ID is required');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Amount in cents
  const amount = Math.round(order.total * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: { orderId: order._id.toString() },
  });

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});

/**
 * =========================================================
 * @desc    Confirm Payment (Webhook)
 * @route   POST /api/payment/webhook
 * @access  Public (Called by Stripe)
 * =========================================================
 */
const stripeWebhookController = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    // Update order status
    const orderId = paymentIntent.metadata.orderId;
    const order = await Order.findById(orderId);
    if (order) {
      order.paymentStatus = 'Paid';
      order.status = 'Paid';
      order.isPaid = true;
      order.paidAt = new Date();
      order.stripeSessionId = paymentIntent.id;
      await order.save();
    }
  }

  res.status(200).json({ received: true });
});

export { createPaymentIntentController, stripeWebhookController };
