// routes/examRoutes.js
const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

router.post('/add', examController.createExam);

module.exports = router;
