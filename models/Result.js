const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    marksObtained: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    grade: { type: String }
}, { timestamps: true });

// Auto-calculate grade before saving
ResultSchema.pre('save', function (next) {
    const percentage = (this.marksObtained / this.totalMarks) * 100;

    if (percentage >= 90) this.grade = 'A+';
    else if (percentage >= 80) this.grade = 'A';
    else if (percentage >= 70) this.grade = 'B';
    else if (percentage >= 60) this.grade = 'C';
    else this.grade = 'F';

    next();
});

module.exports = mongoose.model('Result', ResultSchema);
