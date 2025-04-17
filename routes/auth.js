const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    console.log('✅ Registered:', { username, email });
    res.status(200).json({ message: 'User registered successfully' });
});

module.exports = router;
