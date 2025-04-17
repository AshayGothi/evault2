const express = require('express');
const router = express.Router();

// Dummy registration endpoint for testing
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Replace this with real DB logic later
    console.log('✅ Registered:', { username, email });
    res.status(200).json({ message: 'User registered successfully' });
});

module.exports = router;
