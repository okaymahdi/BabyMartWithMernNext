import bodyParser from 'body-parser';
import express from 'express';
import {
  createPaymentIntentController,
  stripeWebhookController,
} from '../controllers/payment.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const paymentRoutes = express.Router();

// Create Stripe Payment Intent
paymentRoutes.post(
  '/create-payment-intent',
  protect,
  createPaymentIntentController,
);

// Stripe Webhook (Raw Body Required)
paymentRoutes.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  stripeWebhookController,
);

export default paymentRoutes;
