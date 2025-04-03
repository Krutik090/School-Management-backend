const express = require('express');
const studentController = require('../controllers/studentController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const studentDir = `uploads/${req.body.firstName}_${req.body.lastName}`;
        fs.mkdirSync(studentDir, { recursive: true }); // Create folder if not exists
        cb(null, studentDir);
    },
    filename: function (req, file, cb) {
        cb(null, 'photo' + path.extname(file.originalname)); // Store as photo.png
    }
});

const upload = multer({ storage: storage });

// Route to Add Student
router.post('/add', upload.single('studentPhoto'), studentController.addStudent);

router.get('/get-all', studentController.getAllStudents);

router.get('/:id', studentController.getStudentById);

router.put('/:id', upload.single('studentPhoto'), studentController.updateStudent);

router.delete('/:id', studentController.deleteStudent);


module.exports = router;
