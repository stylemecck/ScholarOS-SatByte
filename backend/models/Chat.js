const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'assistant'], required: true },
  text: { type: String, required: true },
  mode: { type: String }, // e.g. "Explain Topic", "Solve Doubt"
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'New Chat' },
  folder: { type: String, default: null },
  mode: { type: String, default: 'Explain Topic' },
  messages: [messageSchema],
  memory: { type: String, default: '' } // AI Memory buffer
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
