const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feesController');

// POST /fees/pay → Record fee payment
router.post('/pay', feeController.payFees);

module.exports = router;
