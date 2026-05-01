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
  avatar: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
