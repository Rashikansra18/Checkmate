const express = require('express');
const stripe = require('stripe')(process.env/STRIPE_SECRET); // Use your secret key
const app = express();

const cors = require('cors');

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your React app's origin
  methods: ['GET', 'POST'],       // Allow specific HTTP methods
  allowedHeaders: ['Content-Type'] // Allow specific headers
}));


app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,  // Amount in smallest unit (e.g., paise for INR)
      currency: 'inr', // Currency code
      payment_method_types: ['upi'],  // UPI as payment method
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send('Internal Server Error');
  }
});

const port = 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
