const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedResults: [{
    toolName: String,
    data: mongoose.Schema.Types.Mixed,
    date: { type: Date, default: Date.now }
  }],
  credits: { type: Number, default: 5 }, // New users get 5 free credits
  creditHistory: [{
    type: { type: String, enum: ['spent', 'added', 'bonus'], required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now }
  }],
  isGoogleUser: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referralsCount: { type: Number, default: 0 },
  avatar: { type: String },
  phoneNumber: { type: String },
  address: {
    line1: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, default: 'India' }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
