const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true }, // Duration in minutes
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Exam', ExamSchema);
