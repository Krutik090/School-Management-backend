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


exports.getFeesByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;

        const fees = await Fee.find({ student: studentId }).populate('student', 'name email');

        if (!fees || fees.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No fee records found for the student',
            });
        }

        res.status(200).json({
            success: true,
            fees,
        });
    } catch (error) {
        console.error('Error fetching fees:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching fee details',
        });
    }
};

exports.getPendingFees = async (req, res) => {
    try {
        const pendingFees = await Fee.find({ status: 'pending' }).populate('student', 'name email');
        if (!pendingFees || pendingFees.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No pending fees found',
            });
        }

        res.status(200).json({
            success: true,
            fees: pendingFees,
        });
    } catch (error) {
        console.error('Error fetching pending fees:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching pending fees',
        });
    }
};