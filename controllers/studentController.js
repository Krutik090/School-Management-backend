const Student = require('../models/Student');
const fs = require('fs');
const path = require('path');

exports.addStudent = async (req, res) => {
    try {
        const { firstName, lastName, gender, dateOfBirth, roll, class: studentClass, section, admissionID, phone, aadharCard } = req.body;

        if (!firstName || !lastName || !gender || !dateOfBirth || !roll || !studentClass || !section || !admissionID || !phone || !aadharCard) {
            return res.status(400).json({ message: "All required fields must be filled." });
        }

        const existingStudent = await Student.findOne({ $or: [{ roll }, { admissionID }, { aadharCard }] });
        if (existingStudent) {
            return res.status(400).json({ message: "Student with this Roll No, Admission ID, or Aadhar already exists." });
        }

        // Check if file exists
        const studentPhotoPath = req.file ? req.file.path : null;

        // Create student record
        const newStudent = new Student({
            firstName,
            lastName,
            gender,
            dateOfBirth,
            roll,
            class: studentClass,
            section,
            admissionID,
            phone,
            aadharCard,
            studentPhoto: studentPhotoPath
        });

        await newStudent.save();
        res.status(201).json({ message: "Student added successfully!", student: newStudent });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc   Get all students
// @route  GET /api/students
// @access Public
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find(); // Fetch all students
        console.log(students);
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// @desc   Get a student by ID
// @route  GET /api/students/:id
// @access Public
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateStudent =  async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Check if student exists
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Handle student photo update
        if (req.file) {
            // Delete old photo if exists
            if (student.studentPhoto) {
                const oldPhotoPath = path.join(__dirname, '..', student.studentPhoto);
                if (fs.existsSync(oldPhotoPath)) {
                    fs.unlinkSync(oldPhotoPath);
                }
            }

            // Assign new photo path
            updates.studentPhoto = req.file.path;
        }

        // Update student details
        Object.assign(student, updates);

        await student.save();
        res.status(200).json({ message: "Student updated successfully!", student });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.deleteStudent= async (req, res) => {
    try {
        const { id } = req.params;

        // Find student by ID
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Delete the student's photo if it exists
        if (student.studentPhoto) {
            const photoPath = path.join(__dirname, '../', student.studentPhoto);
            console.log(photoPath);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath); // Delete the file
            }
        }

        // Delete student record
        await Student.findByIdAndDelete(id);

        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};