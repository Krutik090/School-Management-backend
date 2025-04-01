const jwt = require('jsonwebtoken');
const {User} = require('../models/User');
require('dotenv').config();
const argon2 = require('argon2');

// Login function with secure token handling
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fetch user from database
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token with 9 hours expiration
        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '9h' } //  9 Hours Expiration
        );

        // Set HttpOnly cookie for JWT Token
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: 'Lax',
            maxAge: 9 * 60 * 60 * 1000, //  9 Hours in milliseconds
        });

        // Store user data in readable cookie
        res.cookie('userData', JSON.stringify({ name: user.name, id: user._id, role: user.role }), {
            httpOnly: false, // Readable in frontend
            secure: false,
            sameSite: 'Lax',
            maxAge: 9 * 60 * 60 * 1000, //  9 Hours in milliseconds
        });

        res.json({ role: user.role, name: user.name, id: user._id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.logout = (req, res) => {

    res.clearCookie('token', {
        httpOnly: true,
        secure: false, // Set to true in production (requires HTTPS)
        sameSite: 'Lax', // Allows authentication cookies to be cleared
    });

    res.clearCookie('userData', {
        httpOnly: false,
        secure: false, // Set to true in production (requires HTTPS)
        sameSite: 'Lax', // Allows authentication cookies to be cleared
    });

    res.json({ message: 'Logged out successfully' });
};

exports.getRole = async (req, res) => {
    try {
        // Fetch user role from database
        const user = await User.findById(req.user.id).select('role');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ role: user.role });
    } catch (error) {
        console.error('Error fetching role:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password using Argon2
        const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });

        // Create new user
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getProfile = async (req, res) => {
    try {
        // Get user details from decoded token
        const user = await User.findById(req.user.id).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id; // User ID from JWT token (auth middleware)

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify old password
        const isMatch = await argon2.verify(user.password, oldPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect old password' });
        }

        // Hash new password and update
        user.password = await argon2.hash(newPassword, { type: argon2.argon2id });
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
