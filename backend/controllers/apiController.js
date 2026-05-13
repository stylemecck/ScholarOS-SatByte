const ApiKey = require('../models/ApiKey');

/**
 * Generate a new API Key for the logged-in user
 */
exports.generateKey = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Check if user already has too many keys (limit: 5 for free tier)
    const existingKeys = await ApiKey.countDocuments({ user: req.user.userId, status: 'active' });
    if (existingKeys >= 5) {
      return res.status(403).json({ 
        error: 'Key limit reached', 
        details: 'Free tier is limited to 5 active API keys.' 
      });
    }

    const apiKey = new ApiKey({
      user: req.user.userId,
      name: name || `Key ${existingKeys + 1}`
    });

    await apiKey.save();
    res.status(201).json(apiKey);
  } catch (err) {
    console.error('Generate Key Error:', err);
    res.status(500).json({ error: 'Failed to generate API key' });
  }
};

/**
 * List all API Keys for the logged-in user
 */
exports.listKeys = async (req, res) => {
  try {
    const keys = await ApiKey.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(keys);
  } catch (err) {
    console.error('List Keys Error:', err);
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
};

/**
 * Revoke an API Key
 */
exports.revokeKey = async (req, res) => {
  try {
    const { id } = req.params;
    const apiKey = await ApiKey.findOne({ _id: id, user: req.user.userId });

    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    apiKey.status = 'revoked';
    await apiKey.save();
    res.json({ message: 'API key revoked successfully' });
  } catch (err) {
    console.error('Revoke Key Error:', err);
    res.status(500).json({ error: 'Failed to revoke API key' });
  }
};

/**
 * Get Usage Stats for a specific key
 */
exports.getStats = async (req, res) => {
  try {
    const { id } = req.params;
    const apiKey = await ApiKey.findOne({ _id: id, user: req.user.userId });

    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    // Simplified stats for now
    res.json({
      keyName: apiKey.name,
      usage: apiKey.usageCount,
      limit: apiKey.monthlyLimit,
      remaining: apiKey.monthlyLimit - apiKey.usageCount,
      lastUsed: apiKey.lastUsedAt
    });
  } catch (err) {
    console.error('Get Stats Error:', err);
    res.status(500).json({ error: 'Failed to fetch usage stats' });
  }
};
