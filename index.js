const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables early
dotenv.config();

// Debug email config
console.log("📨 Email Config from ENV:", process.env.EMAIL_USER || 'Missing', process.env.EMAIL_PASS ? 'Loaded' : 'Missing');

// Initialize Express app
const app = express();

// Import routes and middleware
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const documentRoutes = require('./server/routes/documentRoutes');
const errorHandler = require('./server/middleware/errorHandler');
const logger = require('./server/middleware/logger');

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/auth', require('./routes/auth'));

// Serve frontend static files (React build folder)
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Fallback to frontend for any unknown route (non-API)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Error handling middleware (must be after routes)
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// Log masked email credentials
console.log('📧 Email settings:', {
  user: process.env.EMAIL_USER || 'Not Set',
  pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0, 4) + '****' : 'Missing'
});
