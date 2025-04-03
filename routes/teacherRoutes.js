const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

router.post('/add', teacherController.addTeacher);

router.get('/get-all', teacherController.getAllTeachers);

router.get('/:id', teacherController.getTeacherById);

router.put('/:id', teacherController.updateTeacher);

router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;
