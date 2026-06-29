const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true }, // e.g. pdf, docx, pptx, txt, png, jpg
  fileSize: { type: Number },
  textContent: { type: String, default: '' },
  folder: { type: String, default: null },
  isFavorite: { type: Boolean, default: false },
  notes: [{
    title: String,
    content: String,
    date: { type: Date, default: Date.now }
  }],
  annotations: [{
    page: Number,
    type: { type: String, enum: ['highlight', 'underline', 'text'], default: 'highlight' },
    color: { type: String, default: 'yellow' },
    text: String,
    comment: String
  }],
  bookmarks: [Number], // Page numbers bookmarked
  readingProgress: { type: Number, default: 0 } // Percentage 0 - 100
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
