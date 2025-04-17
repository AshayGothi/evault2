// index.js (place this at your root or server/index.js if you're separating frontend and backend)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth'); // Make sure this file exists
const documentRoutes = require('./routes/documentRoutes'); // Make sure this file exists

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// Serve React frontend from client/build
app.use(express.static(path.join(__dirname, '../client/build')));

// Fallback route for React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
