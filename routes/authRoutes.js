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


module.exports= router;