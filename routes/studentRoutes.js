const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController')

router.get('/get-students', studentController.getStudents);

module.exports = router;