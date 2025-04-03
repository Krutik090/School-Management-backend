const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

// Route to create a new class
router.post('/add', classController.createClass);

// GET all classes
router.get("/get-all", classController.getAllClasses);

router.get('/:id', classController.getClassById);

router.put('/:id', classController.updateClass);

router.delete('/:id', classController.deleteClass);

module.exports = router;
