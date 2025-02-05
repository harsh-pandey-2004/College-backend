const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = "your_secret_key"; // Change this in production

// Store OTPs temporarily (in-memory for now)
let otpStore = {}; // This is for demo purposes. Use a more robust solution in production like Redis

// Signup
exports.signup = async (req, res) => {
    try {
        const { name, email, phone, city, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, phone, city, password: hashedPassword });
        await newUser.save();

        res.json({ message: "User registered successfully, use OTP to verify." });
    } catch (error) {
        res.status(500).json({ message: "Error signing up", error });
    }
};

// Generate and Send Static OTP
exports.sendOTP = async (req, res) => {
    const { phone } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    // Use static OTP for testing
    const otp = "123456"; // Static OTP

    // Store the static OTP temporarily
    otpStore[phone] = otp;

    // Simulate sending OTP (replace with actual SMS service in production)
    console.log(`OTP for ${phone}: ${otp}`); // In production, you would send the OTP via SMS/Email

    res.json({ message: `OTP sent successfully to ${phone}` });
};

// Verify Static OTP and Login
exports.verifyOTP = async (req, res) => {
    const { phone, otp } = req.body;

    // Check if OTP exists for the phone number
    const storedOtp = otpStore[phone];
    
    if (!storedOtp) {
        return res.status(400).json({ message: "OTP has expired or was not requested" });
    }

    if (otp !== storedOtp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid, mark user as verified
    const user = await User.findOneAndUpdate({ phone }, { isVerified: true });

    // Remove OTP from memory
    delete otpStore[phone];

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: "OTP Verified Successfully", token });
};
