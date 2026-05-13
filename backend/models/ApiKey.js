const mongoose = require('mongoose');
const crypto = require('crypto');

const apiKeySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  key: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    default: 'Default API Key'
  },
  tier: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'revoked'],
    default: 'active'
  },
  usageCount: {
    type: Number,
    default: 0
  },
  dailyUsage: [{
    date: String, // YYYY-MM-DD
    count: Number
  }],
  monthlyLimit: {
    type: Number,
    default: 1000 // Free tier default
  },
  lastUsedAt: Date,
  expiresAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate a secure API key before saving
apiKeySchema.pre('validate', function(next) {
  if (!this.key) {
    this.key = `stp_${crypto.randomBytes(24).toString('hex')}`;
  }
  next();
});

module.exports = mongoose.model('ApiKey', apiKeySchema);
