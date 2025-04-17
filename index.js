const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config(); // Load env variables early

// Log email config for debug
console.log("📨 Email Config from ENV:", process.env.EMAIL_USER || 'Missing', process.env.EMAIL_PASS ? 'Loaded' : 'Missing');

const authRoutes = require('./server/routes/authRoutes');
const documentRoutes = require('./server/routes/documentRoutes');
const errorHandler = require('./server/middleware/errorHandler');
const logger = require('./server/middleware/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// Serve static frontend (React build folder)
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Fallback to frontend for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// Masked email log
console.log('📧 Email settings:', {
  user: process.env.EMAIL_USER || 'Not Set',
  pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0, 4) + '****' : 'Missing'
});
