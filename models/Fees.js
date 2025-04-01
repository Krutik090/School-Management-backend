const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['paid', 'pending'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Fee', FeeSchema);
