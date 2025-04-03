const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    dateOfBirth: { type: Date, required: true },
    roll: { type: String, required: true },
    bloodGroup: { type: String },
    religion: { type: String },
    email: { type: String, unique: true, sparse: true }, // Email is optional
    class: { type: String, required: true },
    section: { type: String, required: true },
    admissionID: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    shortBio: { type: String },
    studentPhoto: { type: String }, // Store file path or URL
    aadharCard: { type: String, required: true, unique: true }, // Aadhar Card Number
}, { timestamps: true });

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;
