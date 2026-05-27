// routes/donations.js
// Handles Stripe Checkout session creation for the MTN, Inc. donate page.
//
// Flow:
//   1. Frontend sends POST /api/donations/create-checkout-session  { amount: 2500 }  (cents)
//   2. We create a Stripe Checkout Session with success/cancel redirect URLs
//   3. We return { url } — the frontend redirects the browser there
//   4. Stripe handles all card details, then redirects back to our site

const express = require('express');
const router  = express.Router();
const Stripe  = require('stripe');

// Stripe is initialised lazily inside the route handler so the server
// can start without a key — donations simply won't work until the key is added
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set. Add it in Render environment variables.');
  }
  return Stripe(process.env.STRIPE_SECRET_KEY);
};

// The URL of our deployed frontend — used for Stripe's success/cancel redirects
// Falls back to localhost:4200 during local development
const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:4200';

// POST /api/donations/create-checkout-session
// Body: { amount: number }   — dollar amount (e.g. 50 = $50.00)
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate: amount must be a positive number, $1 minimum
    if (!amount || isNaN(amount) || amount < 1) {
      return res.status(400).json({ message: 'Please provide a valid donation amount (minimum $1).' });
    }

    // Stripe works in the smallest currency unit (cents for USD)
    const amountInCents = Math.round(Number(amount) * 100);

    // Create a Stripe Checkout Session
    // Stripe hosts the payment page — we never touch card details
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',   // one-time payment (use 'subscription' for recurring)
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Donation to MTN, Inc.',
              description: 'Your gift helps fight food insecurity and fund workforce training in Missouri.',
              images: [],   // optional: add a hosted logo URL here
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      // After payment Stripe redirects here — we show a thank-you message
      success_url: `${FRONTEND}/donate?status=success`,
      // If the donor cancels, send them back to the donate page
      cancel_url:  `${FRONTEND}/donate?status=cancel`,
    });

    // Return the Checkout URL to the frontend
    res.json({ url: session.url });

  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ message: 'Unable to create checkout session. Please try again.' });
  }
});

module.exports = router;
