const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

exports.createOrder = async (req, res) => {
  try {
    const { amount, credits } = req.body;
    
    // Initialize Razorpay inside to ensure process.env is ready
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(amount * 100), 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { 
        credits: credits ? credits.toString() : '0', 
        userId: req.user?.userId ? req.user.userId.toString() : 'guest'
      }
    };

    console.log("Creating Razorpay Order with options:", options);
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("RAZORPAY ORDER ERROR:", err);
    res.status(500).json({ 
      error: 'Failed to create Razorpay order', 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, credits } = req.body;

    console.log("Verifying Payment for Order:", razorpay_order_id);

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Handle user credits if logged in
      if (req.user?.userId) {
        const user = await User.findById(req.user.userId);
        if (user && credits && parseInt(credits) > 0) {
          user.credits = (user.credits || 0) + parseInt(credits);
          await user.save();
          return res.json({ message: "Payment verified and credits added", credits: user.credits });
        }
      }
      
      // Guest donation or fallback
      res.json({ message: "Thank you for your generous support!" });
    } else {
      console.error("Signature Mismatch!");
      res.status(400).json({ error: "Invalid payment signature" });
    }
  } catch (err) {
    console.error("VERIFICATION ERROR:", err);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};
