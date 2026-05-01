const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // Create user if they don't exist
      const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      user = new User({
        name,
        email,
        avatar: picture,
        password: Math.random().toString(36).slice(-10), 
        isGoogleUser: true,
        referralCode,
        credits: 10
      });
      await user.save();
    } else if (!user.avatar && picture) {
      // Update existing user with Google picture if they don't have one
      user.avatar = picture;
      await user.save();
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("GOOGLE LOGIN ERROR:", err);
    res.status(500).json({ error: 'Google authentication failed' });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, referredByCode } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role || 'user',
      referralCode,
      credits: 10 // Start with 10 credits
    });

    // Handle Referral
    if (referredByCode) {
      const referrer = await User.findOne({ referralCode: referredByCode.toUpperCase() });
      if (referrer) {
        user.referredBy = referrer._id;
        user.credits += 5; // Bonus for being referred
        
        referrer.credits += 5; // Bonus for referring
        referrer.referralsCount += 1;
        referrer.creditHistory.push({
          amount: 5,
          type: 'added',
          description: `Referral bonus for inviting ${name}`,
          date: new Date()
        });
        await referrer.save();

        // Send Email Notification to Referrer
        const { sendReferralBonusEmail } = require('../utils/emailService');
        sendReferralBonusEmail(referrer.email, referrer.name, 5);

        user.creditHistory.push({
          amount: 5,
          type: 'added',
          description: `Welcome bonus from referral code: ${referredByCode}`,
          date: new Date()
        });
      }
    }
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
