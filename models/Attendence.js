const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['present', 'absent', 'late'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
