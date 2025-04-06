const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// POST /attendance → Mark attendance
router.post('/mark', attendanceController.markAttendance);

// GET /attendance/:classId → Get attendance for a class
router.get('/:classId', attendanceController.getAttendanceByClass);

module.exports = router;
