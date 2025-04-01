const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes in user routes
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Role-Based Access Control
router.get('/role', authMiddleware.verifyToken, authController.getRole);
router.get('/is-authenticated', authMiddleware.verifyToken, (req, res) => res.json({ isAuthenticated: true }));

// Authentication Routes
router.post('/register', authController.register); // Register a new user

// Protected Routes (Requires Authentication)
router.get('/profile', authMiddleware.verifyToken, authController.getProfile); // Get logged-in user profile
router.put('/update-password', authMiddleware.verifyToken, authController.updatePassword); // Update password

module.exports= router;