const express = require('express');
const router = express.Router();

// Importing controller functions
const { signup, sendOTP, verifyOTP } = require('../controllers/authControllers');

// POST routes
router.post('/signup', signup);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;
