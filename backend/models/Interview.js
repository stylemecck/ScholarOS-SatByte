const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true }, // e.g. HR, Technical, Behavioral, Coding, System Design
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  questions: [{
    questionText: String,
    userAnswer: String,
    score: Number, // Accuracy or quality score out of 100
    feedback: String
  }],
  report: {
    communicationScore: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: 0 },
    grammarScore: { type: Number, default: 0 },
    technicalAccuracy: { type: Number, default: 0 },
    speakingSpeed: { type: Number, default: 0 },
    weakAreas: [String],
    improvementTips: [String],
    overallFeedback: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
