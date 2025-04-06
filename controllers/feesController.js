const Fee = require('../models/Fees');

exports.payFees = async (req, res) => {
    try {
        const { student, amount, dueDate } = req.body;

        if (!student || !amount || !dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Student, amount, and dueDate are required',
            });
        }

        const fee = new Fee({
            student,
            amount,
            dueDate,
            status: 'paid',
        });

        const savedFee = await fee.save();

        res.status(201).json({
            success: true,
            message: 'Fee recorded successfully',
            fee: savedFee,
        });
    } catch (error) {
        console.error('Error recording fee:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while recording fee',
        });
    }
};