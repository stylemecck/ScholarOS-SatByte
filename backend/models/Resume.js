const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Untitled Resume' },
  personalInfo: {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    github: { type: String, default: '' },
    title: { type: String, default: '' }
  },
  summary: { type: String, default: '' },
  education: [{
    institution: String,
    degree: String,
    startDate: String,
    endDate: String,
    location: String
  }],
  experience: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    description: String
  }],
  projects: [{
    name: String,
    link: String,
    description: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: String
  }],
  achievements: [{
    description: String
  }],
  skills: [String],
  languages: [String],
  interests: [String],
  template: { type: String, default: 'Modern' },
  themeColor: { type: String, default: '#8b5cf6' },
  fontFamily: { type: String, default: 'Inter' },
  spacing: { type: String, default: 'Normal' },
  fontSize: { type: String, default: 'Normal' },
  atsScore: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
