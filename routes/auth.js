const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            // Check if admin already exists
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({ message: 'Email already registered' });
            }
        } catch (dbError) {
            console.error('Database error during email check:', dbError);
            return res.status(500).json({ 
                message: 'Database connection error. Please ensure MongoDB is running.',
                error: 'DB_CONNECTION_ERROR'
            });
        }

        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new admin
            const admin = new Admin({
                name,
                email,
                password: hashedPassword
            });

            await admin.save();
            res.status(201).json({ message: 'Registration successful' });
        } catch (saveError) {
            console.error('Error saving admin:', saveError);
            res.status(500).json({ 
                message: 'Error saving registration data. Please try again.',
                error: 'DB_SAVE_ERROR'
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Server error during registration',
            error: error.message
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt received:', req.body);
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find admin by email
        const admin = await Admin.findOne({ email });
        console.log('Admin found:', admin ? 'Yes' : 'No');
        
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isValidPassword = await bcrypt.compare(password, admin.password);
        console.log('Password valid:', isValidPassword ? 'Yes' : 'No');

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { 
                id: admin._id, 
                email: admin.email,
                name: admin.name 
            },
            process.env.JWT_SECRET || 'your_jwt_secret_key_here',
            { expiresIn: '24h' }
        );

        // Send response
        res.json({ 
            token, 
            name: admin.name,
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error during login' });
    }
});

module.exports = router;
