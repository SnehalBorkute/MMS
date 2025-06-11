const Razorpay = require('razorpay');
const paymentModel = require('../models/payment');
const User = require('../models/user'); // Your User model
const mongoose = require('mongoose'); // To handle ObjectId conversion
const crypto = require('crypto');

require('dotenv').config(); // This loads the environment variables from the .env file

// Create an instance of Razorpay
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Handle the payment order creation
exports.createOrder = async (req, res) => {
    const { amount, userId } = req.body; // Get amount and userId from request body

    try {
        // Check if the userId is valid
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ message: 'Invalid userId' });
        }

        // Convert userId to ObjectId correctly
        const userObjectId = new mongoose.Types.ObjectId(userId); // Use new here

        // Create an order with Razorpay
        const options = {
            amount: amount * 100, // amount in paise
            currency: 'INR',
            receipt: `receipt#${new Date().getTime()}`,
            payment_capture: 1 // Auto-capture the payment immediately
        };

        razorpayInstance.orders.create(options, async (err, order) => {
            if (err) {
                return res.status(500).send(err);
            }

            // Store order in database (optional)
            const payment = new paymentModel({
                userId: userObjectId,  // Store userId as ObjectId
                amount,
                paymentId: order.id,
                status: 'pending'
            });

            await payment.save();

            // Send the order details to the client
            res.json({
                orderId: order.id,
                amount: order.amount,
                currency: order.currency
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Handle payment verification
exports.verifyPayment = async (req, res) => {
    const { paymentId, orderId, signature, userId, amount } = req.body;
    const body = `${orderId}|${paymentId}`;
    const crypto = require('crypto');
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET) // Use the secret key for verification
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === signature) {
        // Payment is verified, update the payment status in DB
        const payment = await paymentModel.findOneAndUpdate(
            { paymentId: paymentId }, // Corrected the paymentId to paymentId here
            { status: 'successful' },
            { new: true }
        );

        if (payment) {
            // Optionally, update user account or order status
            if (mongoose.Types.ObjectId.isValid(userId)) {
                const userObjectId = new mongoose.Types.ObjectId(userId); // Ensure userId is ObjectId here
                await User.findByIdAndUpdate(userObjectId, { status: 'paid' }); // Update the user's status to paid
            }

            res.render('paymentSuccess', { orderId: orderId, amount: amount }); // Render the success page with order details
        } else {
            res.status(400).json({ message: 'Payment record not found' });
        }
    } else {
        res.status(400).json({ message: 'Payment verification failed' });
    }
};

// Route to render the payment page
exports.paymentPage = async (req, res) => {
    const { orderId, amount } = req.query; // Assuming the frontend sends these values
    res.render('payment', { orderId, amount });
}
// exports.renderPaymentPage = (req, res) => {
//     res.render('payment'); // make sure you have views/payment.ejs
// };
exports.renderPaymentPage = (req, res) => {
    const user = req.session.user; // or req.user, depends on how you're storing session
    if (!user) return res.redirect('/payment');

    res.render('payment', {
        userId: user._id,
        razorpayKey: process.env.RAZORPAY_KEY_ID
    });
};




// Route to render the payment success page
exports.paymentSuccess = async (req, res) => {
    const { orderId, amount } = req.query; // Get these from the query or body if required
    res.render('paymentSuccess', { orderId, amount });
}


