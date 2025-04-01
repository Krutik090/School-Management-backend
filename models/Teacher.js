const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to User model
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }], // Array of subjects
    phone: { type: String, required: true },
    qualification: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', TeacherSchema);
