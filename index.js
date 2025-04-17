const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./server/routes/authRoutes');
const documentRoutes = require('./server/routes/documentRoutes');
const errorHandler = require('./server/middleware/errorHandler');
const logger = require('./server/middleware/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// Error handling
app.use(errorHandler);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((error) => console.error('❌ MongoDB connection error:', error));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

// Log email settings (partially masked)
console.log('📧 Email settings:', {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS?.substring(0, 4) + '****'
});
