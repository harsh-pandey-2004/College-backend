const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = "your_secret_key"; 


let otpStore = {}; 

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

exports.sendOTP = async (req, res) => {
    const { phone } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const otp = "123456"; 

    otpStore[phone] = otp;

    console.log(`OTP for ${phone}: ${otp}`); 

    res.json({ message: `OTP sent successfully to ${phone}` });
};

exports.verifyOTP = async (req, res) => {
    const { phone, otp } = req.body;

    const storedOtp = otpStore[phone];
    
    if (!storedOtp) {
        return res.status(400).json({ message: "OTP has expired or was not requested" });
    }

    if (otp !== storedOtp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.findOneAndUpdate({ phone }, { isVerified: true });

    delete otpStore[phone];

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: "OTP Verified Successfully", token });
};
