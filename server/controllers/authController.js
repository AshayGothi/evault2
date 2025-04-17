const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendVerificationEmail } = require('../utils/emailService');

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        console.log('❌ Missing fields');
        return res.status(400).json({ message: 'All fields are required' });
      }

      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        console.log('❌ User already exists');
        return res.status(400).json({ message: 'Username or email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationCode = generateVerificationCode();
      const verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const user = new User({
        username,
        email,
        password: hashedPassword,
        verificationCode,
        verificationCodeExpires
      });

      await user.save();
      console.log('✅ User saved successfully');

      await sendVerificationEmail(email, verificationCode);
      console.log('✅ Verification email sent');

      res.status(201).json({
        message: 'Registration successful. Please check your email for verification code.'
      });

    } catch (error) {
      console.error('❌ Registration error:', error.message, error.stack);
      res.status(500).json({
        message: 'Registration failed',
        error: error.message
      });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { email, code } = req.body;

      const user = await User.findOne({
        email,
        verificationCode: code,
        verificationCodeExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired verification code' });
      }

      user.verified = true;
      user.verificationCode = null;
      user.verificationCodeExpires = null;
      await user.save();

      res.json({ message: 'Email verified successfully' });

    } catch (error) {
      res.status(500).json({ message: 'Verification failed', error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      if (!user.verified) {
        return res.status(401).json({ message: 'Please verify your email first' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        userId: user._id,
        username: user.username,
        email: user.email
      });

    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  },

  resendVerification: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.verified) {
        return res.status(400).json({ message: 'Email is already verified' });
      }

      const verificationCode = generateVerificationCode();
      user.verificationCode = verificationCode;
      user.verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await user.save();

      await sendVerificationEmail(email, verificationCode);
      res.json({ message: 'Verification email resent successfully' });

    } catch (error) {
      res.status(500).json({ message: 'Error resending verification', error: error.message });
    }
  }
};

module.exports = authController;
