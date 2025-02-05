const express = require('express');
const router = express.Router();

const { signup, sendOTP, verifyOTP } = require('../controllers/authControllers');

router.post('/signup', signup);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;
