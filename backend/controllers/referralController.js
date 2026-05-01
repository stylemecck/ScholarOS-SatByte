const User = require('../models/User');

exports.getReferralNetwork = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Find users referred by this user
    const directReferrals = await User.find({ referredBy: userId })
      .select('name email referralsCount createdAt');
      
    // For a "graph structure", we might want to go deeper (multi-level)
    // But for now, let's start with direct and their direct (Level 2)
    
    const network = {
      user: await User.findById(userId).select('name email referralCode referralsCount'),
      referrals: directReferrals
    };

    res.json(network);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch referral network' });
  }
};
