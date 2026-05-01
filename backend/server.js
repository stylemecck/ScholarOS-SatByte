require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const toolsRoutes = require('./routes/tools');
const studyPlannerRoutes = require('./routes/studyPlanner');
const paymentRoutes = require('./routes/payment');

const app = express();

// Middlewares
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use(cors());
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

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/student-toolkit')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
