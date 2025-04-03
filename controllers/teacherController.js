const mongoose = require('mongoose');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');

exports.addTeacher = async (req, res) => {
    try {
        let { user, subjects, phone, qualification } = req.body;

        if (!user || !phone || !qualification) {
            return res.status(400).json({ message: "User, phone, and qualification are required." });
        }

        // Convert user ID to ObjectId
        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        user = new mongoose.Types.ObjectId(user);

        // Convert subjects to ObjectIds
        if (subjects && !Array.isArray(subjects)) {
            return res.status(400).json({ message: "Subjects should be an array of valid ObjectIds" });
        }
        subjects = subjects?.map(subject => {
            if (!mongoose.Types.ObjectId.isValid(subject)) {
                throw new Error(`Invalid subject ID: ${subject}`);
            }
            return new mongoose.Types.ObjectId(subject);
        });

        // Create new teacher record
        const newTeacher = new Teacher({
            user,
            subjects,
            phone,
            qualification
        });

        await newTeacher.save();
        res.status(201).json({ message: "Teacher added successfully!", teacher: newTeacher });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().populate('user').populate('subjects');
        res.status(200).json(teachers);
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await Teacher.findById(id).populate('user').populate('subjects');

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const { phone, qualification, subjects } = req.body;

        const updatedTeacher = await Teacher.findByIdAndUpdate(
            id,
            { phone, qualification, subjects },
            { new: true, runValidators: true }
        ).populate('user').populate('subjects');

        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.status(200).json({
            message: 'Teacher updated successfully',
            teacher: updatedTeacher
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the teacher
        const teacher = await Teacher.findById(id);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // Delete the teacher
        await Teacher.findByIdAndDelete(id);

        res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};