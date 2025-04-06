const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feesController');

// POST /fees/pay → Record fee payment
router.post('/pay', feeController.payFees);

// GET /fees/pending → Get pending fees
router.get('/pending', feeController.getPendingFees);

// GET /fees/:studentId → Get fee details for a student
router.get('/:studentId', feeController.getFeesByStudent);



module.exports = router;
