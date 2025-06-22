import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
const ORIGIN = process.env.ORIGIN
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

router.post('/create-checkout-session', async (req, res) => {
  try {
    const {amount, listing, userId }=req.body
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Property at ${listing.location}`,
            },
            unit_amount: amount || 10000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${ORIGIN}/success`,
      cancel_url: `${ORIGIN}/`,
    });
    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: (err as any).message });
  }
});

export default router;
