// routes/subjectRoutes.js
const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');

// POST /subjects → Add subject
router.post('/add', subjectController.createSubject);

// GET /subjects → Get all subjects
router.get('/get-all', subjectController.getAllSubjects);

// GET /subjects/:id → Get subject details
router.get('/:id', subjectController.getSubjectById);



module.exports = router;
