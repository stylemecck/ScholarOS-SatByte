const User = require('../models/User');

exports.getReferralNetwork = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Recursive function to get referrals up to a depth
    const getReferralsAtDepth = async (parentIds, currentDepth, maxDepth = 2) => {
      if (currentDepth > maxDepth || parentIds.length === 0) return [];

      const referrals = await User.find({ referredBy: { $in: parentIds } })
        .select('name email referralsCount referredBy createdAt')
        .lean();

      if (referrals.length === 0) return [];

      const nextLevelParentIds = referrals.map(r => r._id);
      const subReferrals = await getReferralsAtDepth(nextLevelParentIds, currentDepth + 1, maxDepth);

      // Attach sub-referrals to their parents
      return referrals.map(r => ({
        ...r,
        subNetwork: subReferrals.filter(sub => sub.referredBy.toString() === r._id.toString())
      }));
    };

    const directReferrals = await getReferralsAtDepth([userId], 1);
    const user = await User.findById(userId).select('name email referralCode referralsCount').lean();

    res.json({
      user,
      referrals: directReferrals
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch referral network' });
  }
};
