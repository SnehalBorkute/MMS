const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route to render the payment page
router.get('/payment-page', paymentController.paymentPage);

// Route to create a Razorpay order (POST)
router.post('/create-order', paymentController.createOrder);

// Route to verify payment (POST)
router.post('/verify-payment', paymentController.verifyPayment);

// Optional: If you need this route, keep it; otherwise, remove it since `verifyPayment` is already handling the success page render.
router.get('/payment-success', paymentController.paymentSuccess);

module.exports = router;
