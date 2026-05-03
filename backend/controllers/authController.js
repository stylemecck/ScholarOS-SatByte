const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const StudyPlan = require('../models/StudyPlan');

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
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, credits: user.credits, referralCode: user.referralCode } });
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
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, credits: user.credits, referralCode: user.referralCode } });
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
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, credits: user.credits, referralCode: user.referralCode } });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.referralCode) {
      user.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      await user.save();
    }

    // Get Study Planner Pulse (Upcoming 3 incomplete tasks)
    const studyPlan = await StudyPlan.findOne({ user: user._id });
    const pulse = studyPlan ? studyPlan.tasks
      .filter(t => !t.completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3) : [];

    res.json({
      ...user.toObject(),
      studyPlannerPulse: pulse
    });
  } catch (err) {
    console.error("GET ME ERROR:", err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.giftCredits = async (req, res) => {
  try {
    const { recipientEmail, amount } = req.body;
    const sender = await User.findById(req.user.userId);
    
    if (sender.credits < amount) {
      return res.status(403).json({ error: 'Insufficient credits' });
    }

    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient user not found' });
    }

    if (sender.email === recipientEmail) {
      return res.status(400).json({ error: 'You cannot gift credits to yourself' });
    }

    // Process Transaction
    sender.credits -= amount;
    sender.creditHistory.push({
      type: 'spent',
      amount,
      description: `Gifted credits to ${recipient.name}`,
      date: new Date()
    });

    recipient.credits += amount;
    recipient.creditHistory.push({
      type: 'added',
      amount,
      description: `Received gift credits from ${sender.name}`,
      date: new Date()
    });

    await sender.save();
    await recipient.save();

    res.json({ message: 'Credits gifted successfully', remainingCredits: sender.credits });
  } catch (err) {
    console.error("GIFT ERROR:", err);
    res.status(500).json({ error: 'Failed to gift credits' });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find()
      .select('name referralsCount avatar')
      .sort({ referralsCount: -1 })
      .limit(10);
    
    res.json(leaderboard);
  } catch (err) {
    console.error("LEADERBOARD ERROR:", err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    await user.save();
    res.json({ message: 'Profile updated successfully', user: { name: user.name, avatar: user.avatar } });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // For Google users, they might not have a password set or should manage via Google
    if (user.isGoogleUser) {
      return res.status(400).json({ error: 'Google users manage security through their Google account' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect current password' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ error: 'Failed to change password' });
  }
};
