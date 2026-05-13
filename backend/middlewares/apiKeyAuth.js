const ApiKey = require('../models/ApiKey');
const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate requests using an API Key or JWT Token
 * Supports both standard API access and internal usage
 */
const apiKeyAuth = async (req, res, next) => {
  const key = req.headers['x-api-key'];
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  // 1. Check for API Key first (External/Dev access)
  if (key) {
    try {
      const apiKeyDoc = await ApiKey.findOne({ key, status: 'active' }).populate('user');
      
      if (!apiKeyDoc) {
        return res.status(403).json({ error: 'Invalid or revoked API key' });
      }

      if (apiKeyDoc.expiresAt && apiKeyDoc.expiresAt < new Date()) {
        return res.status(403).json({ error: 'API key has expired' });
      }

      if (apiKeyDoc.usageCount >= apiKeyDoc.monthlyLimit) {
        return res.status(429).json({ 
          error: 'Usage limit exceeded', 
          details: 'You have reached your monthly API quota.' 
        });
      }

      // Attach user and key info to request
      req.user = {
        userId: apiKeyDoc.user._id,
        role: apiKeyDoc.user.role,
        tier: apiKeyDoc.tier,
        apiKeyId: apiKeyDoc._id
      };

      // Track usage
      apiKeyDoc.usageCount += 1;
      apiKeyDoc.lastUsedAt = new Date();

      // Track daily analytics
      const today = new Date().toISOString().split('T')[0];
      const dailyIdx = apiKeyDoc.dailyUsage.findIndex(d => d.date === today);
      if (dailyIdx > -1) {
        apiKeyDoc.dailyUsage[dailyIdx].count += 1;
      } else {
        apiKeyDoc.dailyUsage.push({ date: today, count: 1 });
        // Keep only last 30 days
        if (apiKeyDoc.dailyUsage.length > 30) apiKeyDoc.dailyUsage.shift();
      }

      await apiKeyDoc.save();

      return next();
    } catch (err) {
      console.error('API Key Auth Error:', err);
      return res.status(500).json({ error: 'Internal server error during authentication' });
    }
  }

  // 2. Fallback to JWT Token (Internal/Web access)
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired session token' });
    }
  }

  return res.status(401).json({ 
    error: 'Authentication required', 
    details: 'Please provide an API key in the x-api-key header or log in.' 
  });
};

module.exports = apiKeyAuth;
