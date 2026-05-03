require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const toolsRoutes = require('./routes/tools');
const studyPlannerRoutes = require('./routes/studyPlanner');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');
const referralRoutes = require('./routes/referral');
const pdfRoutes = require('./routes/pdf');
const imageRoutes = require('./routes/image');
const settingRoutes = require('./routes/settingRoutes');

const app = express();

// Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development to avoid blocking scripts
}));
app.use(morgan('dev')); // Logging
app.use(cors({
  origin: ['http://localhost:5173', 'https://toolkit.satbyte.in'],
  credentials: true,
  exposedHeaders: ["x-rtb-fingerprint-id", "request-id"]
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Student Toolkit Pro API is running',
    status: 'healthy',
    version: '1.0.0'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/study-planner', studyPlannerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/settings', settingRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  // If we can't connect to DB, the server is useless, so we log it clearly
});

// Temp file cleanup system (Runs every hour)
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
setInterval(() => {
  const tempDir = path.join(__dirname, 'temp');
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) return console.error('Cleanup Error:', err);
      const now = Date.now();
      files.forEach(file => {
        const filePath = path.join(tempDir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) return;
          if (now - stats.mtimeMs > CLEANUP_INTERVAL) {
            fs.unlink(filePath, () => {});
          }
        });
      });
    });
  }
}, CLEANUP_INTERVAL);

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
