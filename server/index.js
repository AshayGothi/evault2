const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app = express();

// ✅ CORS config - only set it once
app.use(cors({
  origin: 'https://evault2-1.onrender.com',
  credentials: true,
}));

// Middleware
app.use(express.json());

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ API routes
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documentRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// ✅ Serve React frontend
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
