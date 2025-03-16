const { Student } = require('../models/Student');

exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        if (students) {
            res.status(200).json(students);
        } else {
            res.status(404).json({ message: "Student Not Found" })
        }
    } catch (error) {
        res.status(404).json({ error: 'Error Fetching Data' });
    }
};