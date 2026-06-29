const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true }, // e.g. "Software Engineer", "AI Engineer"
  progress: { type: Number, default: 0 },
  completedNodes: [String], // Node IDs marked completed
  bookmarks: [String], // Bookmarked Node IDs
  notes: [{
    nodeId: String,
    noteText: String,
    updatedAt: { type: Date, default: Date.now }
  }],
  targetDate: { type: Date },
  isGoal: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);
