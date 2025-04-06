const Exam = require('../models/Exam');

exports.createExam = async (req, res) => {
    try {
      const { name, date, duration, class: classId, subject } = req.body;
  
      const exam = new Exam({ name, date, duration, class: classId, subject });
      await exam.save();
  
      res.status(201).json({
        success: true,
        message: 'Exam created successfully',
        exam
      });
    } catch (err) {
      console.error('Error creating exam:', err);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  };