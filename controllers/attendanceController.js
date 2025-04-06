const Attendance = require('../models/Attendence');

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


exports.getAttendanceByClass = async (req, res) => {
    try {
        const { classId } = req.params;

        const attendanceRecords = await Attendance.find({ class: classId })
            .populate('student', 'name rollNumber') // adjust fields as per your Student schema
            .sort({ date: -1 });

        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No attendance records found for this class',
            });
        }

        res.status(200).json({
            success: true,
            attendance: attendanceRecords,
        });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};