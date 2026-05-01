const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  completed: { type: Boolean, default: false },
  date: { type: Date, required: true },
});

const studyPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tasks: [taskSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
