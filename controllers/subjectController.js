// controllers/subjectController.js
const Subject = require('../models/Subject');

exports.createSubject = async (req, res) => {
    try {
        const { name, code, teacher } = req.body;

        // Check if subject with same name or code already exists
        const existingSubject = await Subject.findOne({ $or: [{ name }, { code }] });
        if (existingSubject) {
            return res.status(400).json({
                success: false,
                message: 'Subject with the same name or code already exists'
            });
        }

        const subject = new Subject({ name, code, teacher });
        await subject.save();

        res.status(201).json({
            success: true,
            message: 'Subject created successfully',
            subject
        });
    } catch (error) {
        console.error('Error creating subject:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().populate({
            path: 'teacher',
            populate: { path: 'user', select: 'name email role' } // optional: to get teacher's user details
        });

        res.status(200).json({
            success: true,
            subjects
        });
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id)
            .populate({
                path: 'teacher',
                populate: {
                    path: 'user',
                    select: '_id name email role'
                }
            });

        if (!subject) {
            return res.status(404).json({ success: false, message: 'Subject not found' });
        }

        res.status(200).json({ success: true, subject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.markAttendance = async (req, res) => {
    try {
        const { student, class: classId, date, status } = req.body;

        if (!student || !classId || !status) {
            return res.status(400).json({
                success: false,
                message: 'Student, class, and status are required',
            });
        }

        const existing = await Attendance.findOne({ student, class: classId, date: new Date(date).toDateString() });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Attendance already marked for this student on this date',
            });
        }

        const attendance = new Attendance({
            student,
            class: classId,
            date,
            status,
        });

        await attendance.save();

        res.status(201).json({
            success: true,
            message: 'Attendance marked successfully',
            attendance,
        });
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};