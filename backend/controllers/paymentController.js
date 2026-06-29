const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const { generateInvoicePDF } = require('../utils/invoiceGenerator');
const { sendInvoiceEmail } = require('../utils/emailService');

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

    // Initialize Razorpay to fetch order details securely
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      let orderCredits = 0;
      let orderUserId = null;
      let order = null;

      try {
        console.log("Fetching order details from Razorpay for order:", razorpay_order_id);
        order = await razorpay.orders.fetch(razorpay_order_id);
        if (order && order.notes) {
          orderCredits = parseInt(order.notes.credits) || 0;
          orderUserId = order.notes.userId;
          console.log(`Successfully fetched order details. Credits from order notes: ${orderCredits}, User ID from notes: ${orderUserId}`);
        }
      } catch (fetchErr) {
        console.warn("Failed to fetch Razorpay order details directly, falling back to body parameters.", fetchErr);
        orderCredits = parseInt(credits) || 0;
        orderUserId = req.user?.userId || 'guest';
      }

      // Handle user credits if logged in (authenticated user ID takes priority, fallback to order notes' user ID)
      const targetUserId = req.user?.userId || (orderUserId && orderUserId !== 'guest' ? orderUserId : null);

      if (targetUserId) {
        const user = await User.findById(targetUserId);
        if (user) {
          if (orderCredits > 0) {
            user.credits = (user.credits || 0) + orderCredits;
            user.creditHistory.push({
              type: 'added',
              amount: orderCredits,
              description: `Purchased ${orderCredits} Credits via Razorpay`
            });
            const planName = orderCredits === 12000 || orderCredits === 1000 ? 'Enterprise' : 'Pro';
            user.plan = planName;
            await user.save();
            console.log(`Successfully credited ${orderCredits} credits and upgraded plan to ${planName} for user ${targetUserId}. New balance: ${user.credits}`);
            
            // Generate Tax Invoice PDF & send via Resend asynchronously to not block Razorpay response
            (async () => {
              try {
                console.log(`Generating tax invoice PDF for order: ${razorpay_order_id}`);
                const finalOrder = order || {
                  id: razorpay_order_id,
                  amount: orderCredits === 12000 ? 499000 : orderCredits === 1200 ? 99000 : orderCredits === 1000 ? 49900 : 9900,
                  notes: { credits: orderCredits.toString() }
                };

                const pdfBuffer = await generateInvoicePDF(user, finalOrder, {
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature
                });
                
                const planName = orderCredits === 12000 || orderCredits === 1000 ? 'Business' : 'Pro';
                const duration = orderCredits === 12000 || orderCredits === 1200 ? 'Yearly' : 'Monthly';
                const invoiceNo = `INV-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${(razorpay_payment_id || 'TXT').slice(-6).toUpperCase()}`;

                console.log(`Sending tax invoice email via Resend...`);
                await sendInvoiceEmail(user.email, user.name, pdfBuffer, {
                  invoiceNo,
                  planDetails: `${planName} ${duration} SaaS Plan`,
                  amount: finalOrder.amount ? finalOrder.amount / 100 : 99,
                  phoneNumber: user.phoneNumber || 'N/A'
                });
              } catch (pdfErr) {
                console.error("Failed to generate and email tax invoice PDF:", pdfErr);
              }
            })();

            return res.json({ message: "Payment verified and credits added", credits: user.credits });
          } else {
            console.warn(`Payment verified but 0 or invalid credits found for user ${targetUserId}`);
          }
        } else {
          console.error(`Payment verified but user ${targetUserId} not found in database!`);
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
